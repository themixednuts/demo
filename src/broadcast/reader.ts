import { EDemoCommands } from "@/gen/demo_pb";
import type { BroadcastChunk } from "./chunk";
import { BroadcastFragment } from "./fragment";

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

export type FullDelta = "full" | "delta";
export type States = "sync" | "start" | `fragment-${number}-${FullDelta}`;

export type Scheduler = <T>(
  key: States,
  fn: () => PromiseLike<Readonly<T>> | Readonly<T>,
) => PromiseLike<Readonly<T>>;

interface BroadcastConfig {
  fetch: FetchLike;
  scheduler?: Scheduler;
}

const DEFAULT_CONFIG = {
  fetch: fetch,
} satisfies BroadcastConfig;

export class BroadcastReader {
  #id: number;
  #url: string | URL;
  #config: BroadcastConfig;
  #sync?: Readonly<CEngineGotvSyncPacket>;

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

  get id() {
    return this.#id;
  }

  get url() {
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
      .replace(/\/sync$/, "") // Remove trailing /sync
      .replace(/\/sync\//, "/") // Remove /sync/ in middle
      .replace(/\/\d+\/(start|full|delta)(?:\/|$)/, "") // Remove /{digits}/{action} pattern
      .replace(/\/\d+\/(start|full|delta)\//, "/"); // Remove /{digits}/{action}/ in middle

    const matcher = newUrl.pathname.match(/\/tv\/(\d+)/);
    const id = matcher ? +matcher[1] : null;
    if (id === null) throw new Error("Invalid URL");

    return { url: `${origin}${clean}`, id };
  }

  private async execute<T>(
    key: States,
    fn: () => PromiseLike<Readonly<T>> | Readonly<T>,
  ): Promise<Readonly<T>> {
    const protectedFn = Object.freeze(function (
      this: void,
    ): PromiseLike<Readonly<T>> | Readonly<T> {
      return fn();
    });

    return this.#config.scheduler
      ? await this.#config.scheduler(key, protectedFn)
      : await fn();
  }

  /**
   * Fetches sync data from the broadcast server
   */
  public async sync(): Promise<Readonly<CEngineGotvSyncPacket>> {
    this.#sync = await this.execute("sync", async () => {
      const response = await this.#config.fetch(`${this.#url}/sync`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sync data: ${response.status}`);
      }
      return Object.freeze(await response.json()) as CEngineGotvSyncPacket;
    });
    return this.#sync;
  }

  /**
   * Fetches the start fragment
   */
  public async start(): Promise<Readonly<ArrayBuffer>> {
    const sync = this.#sync;
    if (!sync) {
      throw new Error("Must call sync() first");
    }

    return await this.execute("start", async () => {
      const response = await this.#config.fetch(
        `${this.#url}/${sync.signup_fragment}/start`,
      );
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.statusText}: ${text}`);
      }
      return Object.freeze(await response.arrayBuffer());
    });
  }

  /**
   * Fetches a specific fragment
   */
  public async fragment(
    fragmentId: number,
    isDelta: boolean = false,
  ): Promise<Readonly<BroadcastFragment>> {
    const fullDelta = isDelta ? "delta" : "full";
    return await this.execute(
      `fragment-${fragmentId}-${fullDelta}`,
      async () => {
        const response = await this.#config.fetch(
          `${this.#url}/${fragmentId}/${fullDelta}`,
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
    );
  }

  public async *stream(): AsyncGenerator<Readonly<BroadcastChunk>> {
    const sync = await this.sync();
    if (!sync) {
      throw new Error("Must call sync() first");
    }

    if (sync.signup_fragment == null) {
      throw new Error("Unexpected error");
    }

    if (sync.fragment == null) {
      throw new Error("Unexpected error");
    }

    const start = await this.start();

    let currentFragmentId = sync.fragment;
    let stop = false;
    let isDelta = false;

    while (!stop) {
      const fragment = await this.fragment(currentFragmentId, isDelta);
      for (const chunk of fragment.chunks()) {
        if (chunk.command === EDemoCommands.DEM_Stop) stop = true;
        yield Object.freeze(chunk);
      }
      if (!isDelta) isDelta = true;
      else currentFragmentId++;
    }
  }
}
