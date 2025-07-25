import { EDemoCommands } from '@/gen/demo_pb.ts';
import type { BroadcastChunk } from './chunk.ts';
import { BroadcastFragment } from './fragment.ts';
import { executeWithRetry, type RetryConfig } from '../micro/retry.ts';

export interface CEngineGotvSyncPacket {
	tick: number;
	endtick: number;
	maxtick: number;
	rtdelay: number;
	rcvage: number;
	fragment: number;
	signup_fragment: number;
	tps: number;
	keyframe_interval: number;
	map: string;
	protocol: number;
}

export type FetchLike<
	TRequest = Request,
	TRequestInit = RequestInit,
	TResponse = Response,
> = (url: string | URL | TRequest, init?: TRequestInit) => Promise<TResponse>;

export type FullDelta = 'full' | 'delta';
export type State = 'sync' | 'start' | `fragment-${number}-${FullDelta}`;

export type APIConfig = {
	signal?: AbortSignal;
	retryCfg?: RetryConfig;
};

export type Scheduler = <T>(
	key: State,
	fn: () => PromiseLike<Readonly<T>> | Readonly<T>,
) => PromiseLike<Readonly<T>>;

export interface BroadcastConfig {
	fetch?: FetchLike;
	scheduler?: Scheduler;
}

export interface StreamOptions {
	signal?: AbortSignal;
	retryCfg?: RetryConfig;
}

const DEFAULT_CONFIG = {
	fetch: fetch,
} satisfies BroadcastConfig;

export class BroadcastReader {
	#id: number;
	#url: string | URL;
	#config: BroadcastConfig;

	private constructor(
		url: string | URL,
		config: BroadcastConfig = DEFAULT_CONFIG,
	) {
		const { url: cleanUrl, id } = BroadcastReader.getBaseUrl(url);
		console.log(cleanUrl);
		this.#id = id;
		this.#url = cleanUrl;
		this.#config = config;
	}

	get id(): number {
		return this.#id;
	}

	get url(): string | URL {
		return this.#url;
	}

	/**
	 * Creates a new Broadcast instance.
	 * @param url - The Base URL of the broadcast.
	 * @returns A new Broadcast instance.
	 */
	public static new(
		url: string | URL,
		config?: BroadcastConfig,
	): BroadcastReader {
		return new BroadcastReader(url, config);
	}

	private static getBaseUrl(url: string | URL): { url: string; id: number } {
		const newUrl = url instanceof URL ? url : new URL(url);
		const { pathname, origin } = newUrl;
		const clean = pathname
			.replace(/\/sync$/, '') // Remove trailing /sync
			.replace(/\/sync\//, '/') // Remove /sync/ in middle
			.replace(/\/\d+\/(start|full|delta)(?:\/|$)/, '') // Remove /{digits}/{action} pattern
			.replace(/\/\d+\/(start|full|delta)\//, '/'); // Remove /{digits}/{action}/ in middle

		const matcher = newUrl.pathname.match(/\/tv\/(\d+)/);
		const id = matcher ? +matcher[1] : null;
		if (id === null) throw new Error('Invalid URL');

		return { url: `${origin}${clean}`, id };
	}

	private async execute<T>(
		key: State,
		fn: () => PromiseLike<Readonly<T>> | Readonly<T>,
		cfg?: RetryConfig,
	): Promise<Readonly<T>> {
		const protectedFn = Object.freeze(function (
			this: void,
		): PromiseLike<Readonly<T>> | Readonly<T> {
			return fn();
		});

		return this.#config.scheduler
			? await this.#config.scheduler(key, protectedFn)
			: await executeWithRetry(fn, cfg);
	}

	/**
	 * Fetches sync data from the broadcast server
	 */
	private async sync(
		options?: APIConfig,
	): Promise<Readonly<CEngineGotvSyncPacket>> {
		const { signal, retryCfg } = options ?? {};
		return await this.execute(
			'sync',
			async () => {
				const fetchFn = this.#config.fetch ?? fetch;
				const response = await fetchFn(`${this.#url}/sync`, {
					signal,
				});
				if (!response.ok) {
					throw new Error(`Failed to fetch sync data: ${response.status}`);
				}
				return Object.freeze(await response.json()) as CEngineGotvSyncPacket;
			},
			retryCfg,
		);
	}

	/**
	 * Fetches the start fragment
	 */
	private async start(
		fragment: number,
		options?: APIConfig,
	): Promise<Readonly<ArrayBuffer>> {
		const { signal, retryCfg } = options ?? {};
		return await this.execute(
			'start',
			async () => {
				const fetchFn = this.#config.fetch ?? fetch;

				const response = await fetchFn(`${this.#url}/${fragment}/start`, {
					signal,
				});
				if (!response.ok) {
					const text = await response.text();
					throw new Error(`${response.statusText}: ${text}`);
				}
				return Object.freeze(await response.arrayBuffer());
			},
			retryCfg,
		);
	}

	/**
	 * Fetches a specific fragment
	 */
	public async fragment(
		fragmentId: number,
		isDelta: boolean = false,
		options?: APIConfig,
	): Promise<Readonly<BroadcastFragment>> {
		const fullDelta = isDelta ? 'delta' : 'full';
		const { signal, retryCfg } = options ?? {};
		return await this.execute(
			`fragment-${fragmentId}-${fullDelta}`,
			async () => {
				const fetchFn = this.#config.fetch ?? fetch;
				const response = await fetchFn(
					`${this.#url}/${fragmentId}/${fullDelta}`,
					{ signal },
				);
				if (!response.ok) {
					throw new Error(
						`Failed to fetch fragment ${fragmentId}: ${response.status}`,
					);
				}
				return Object.freeze(
					BroadcastFragment.from(await response.arrayBuffer()),
				);
			},
			retryCfg,
		);
	}

	public async *stream(
		options?: StreamOptions,
	): AsyncGenerator<{ fragment: number; chunk: Readonly<BroadcastChunk> }> {
		const { signal } = options ?? {};
		const sync = await this.sync(options);

		if (sync.signup_fragment == null || sync.fragment == null) {
			throw new Error('Unexpected error');
		}

		const start = await this.start(sync.signup_fragment, options);
		const fragment = BroadcastFragment.from(start);
		for (const chunk of fragment.chunks()) {
			if (signal?.aborted) return;
			yield Object.freeze({ fragment: sync.signup_fragment, chunk });
		}

		let currentFragmentId = sync.fragment;
		let stop = false;
		let isDelta = false;

		while (!stop && !signal?.aborted) {
			const fragment = await this.fragment(currentFragmentId, isDelta, options);
			for (const chunk of fragment.chunks()) {
				if (signal?.aborted) return;
				if (chunk.command === EDemoCommands.DEM_Stop) stop = true;
				yield Object.freeze({ fragment: currentFragmentId, chunk });
			}
			if (!isDelta) isDelta = true;
			else currentFragmentId++;
		}
	}
}
