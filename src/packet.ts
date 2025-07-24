import { BitBuffer } from '@/buffers/bit.ts';
import {
	CitadelGameEvent,
	CitadelUserMessage,
	GameEvent,
	NetMessage,
	NetMessageBase,
	TempEntity,
	UserMessage,
} from './decoders/mod.ts';

export class PacketParsingError extends Error {
	constructor(
		message: string,
		public readonly cursor: number,
		public readonly remainingBytes: number,
		public readonly type?: number,
		public readonly size?: number,
	) {
		super(message);
		this.name = 'PacketParsingError';
	}
}

const REGISTRY = [
	NetMessage.registry,
	NetMessageBase.registry,
	CitadelGameEvent.registry,
	CitadelUserMessage.registry,
	GameEvent.registry,
	TempEntity.registry,
	UserMessage.registry,
];

const REGISTRY_LOOKUP = REGISTRY.reduce((acc, cur) => {
	for (const enumObj of cur.enums) {
		for (const value of Object.values(enumObj)) {
			if (typeof value === 'number') {
				acc.set(value, cur.decode);
			}
		}
	}
	return acc;
}, new Map<number, typeof REGISTRY[number]['decode']>());

/**
 * Represents a packet
 */
export class DemoPacket {
	readonly #type: number;
	readonly #size: number;
	readonly #data: Uint8Array;

	protected constructor(type: number, size: number, data: Uint8Array) {
		this.#type = type;
		this.#size = size;
		this.#data = data;
	}

	public get type(): number {
		return this.#type;
	}

	public get size(): number {
		return this.#size;
	}

	public get data(): Uint8Array {
		return this.#data;
	}

	public decode(): ReturnType<typeof REGISTRY[number]['decode']> {
		const decoder = REGISTRY_LOOKUP.get(this.#type);
		if (decoder) {
			//@ts-expect-error because
			return decoder(this.#type, this.#data);
		}
		throw new Error(`Unknown packet type: ${this.#type}`);
	}

	public static *from(buffer: BitBuffer | Uint8Array): Generator<DemoPacket> {
		yield* this._from(buffer, (buffer) => {
			const { type, size, data } = this.parse(buffer);
			return new DemoPacket(type, size, data);
		});
	}

	// Common parsing logic that can be customized by subclasses
	protected static *parseFromBuffer<T extends DemoPacket>(
		buffer: BitBuffer,
		parsePacket: (buffer: BitBuffer) => T,
	): Generator<T> {
		while (buffer.remaining_bytes() > 0) {
			yield parsePacket(buffer);
		}
	}

	// Wrapper to handle different buffer types
	protected static *_from<T extends DemoPacket>(
		buffer: BitBuffer | Uint8Array,
		parsePacket: (buffer: BitBuffer) => T,
	): Generator<T> {
		if (buffer instanceof BitBuffer) {
			yield* this.parseFromBuffer(buffer, parsePacket);
		} else if (buffer instanceof Uint8Array) {
			const bitbuffer = BitBuffer.from(buffer);
			yield* this.parseFromBuffer(bitbuffer, parsePacket);
		} else {
			throw new Error(`Invalid buffer type: ${typeof buffer}`);
		}
	}

	// Common packet parsing logic
	protected static parse(
		buffer: BitBuffer,
	): { type: number; size: number; data: Uint8Array } {
		// Check if we have enough data to read at least the header
		if (buffer.remaining_bytes() < 1) {
			throw new PacketParsingError(
				`Not enough data to read packet header. Remaining: ${buffer.remaining_bytes()} bytes`,
				buffer.cursor,
				buffer.remaining_bytes(),
			);
		}

		const type: number = buffer.read_uvarbit();
		const size = buffer.read_uvarint32();

		// Validate size is reasonable
		if (size < 0 || size > buffer.remaining_bytes()) {
			throw new PacketParsingError(
				`Invalid packet size: ${size} bytes. Remaining buffer: ${buffer.remaining_bytes()} bytes. Buffer may be corrupted.`,
				buffer.cursor,
				buffer.remaining_bytes(),
				type,
				size,
			);
		}

		const data = buffer.read_bytes(size);
		return { type, size, data };
	}
}

export class SequenceDemoPacket extends DemoPacket {
	readonly #sequence: number;

	private constructor(
		sequence: number,
		type: number,
		size: number,
		data: Uint8Array,
	) {
		super(type, size, data);
		this.#sequence = sequence;
	}

	public static override *from(
		buffer: BitBuffer | Uint8Array,
	): Generator<SequenceDemoPacket> {
		yield* this._from(buffer, (buffer) => {
			// Check if we have enough data for sequence number
			if (buffer.remaining_bytes() < 1) {
				throw new PacketParsingError(
					`Not enough data to read sequence number. Remaining: ${buffer.remaining_bytes()} bytes`,
					buffer.cursor,
					buffer.remaining_bytes(),
				);
			}

			const sequence = buffer.read_uvarbit();
			const { type, size, data } = this.parse(buffer);
			return new SequenceDemoPacket(sequence, type, size, data);
		});
	}
	public get sequence(): number {
		return this.#sequence;
	}
}
