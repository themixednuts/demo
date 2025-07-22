import type { BitBuffer } from "@/buffers/bit.ts";
import netmessage_base from "@/decoders/netmessage.base.ts";
import netmessage from "@/decoders/netmessage.ts";
import usermessage from "@/decoders/usermessage.ts";
import citadel_gameevent from "@/decoders/citadel_gameevent.ts";
import citadel_usermessage from "@/decoders/citadel_usermessage.ts";
import temp_entity from "@/decoders/temp_entity.ts";
import game_event from "@/decoders/gameevent.ts";
import { NET_Messages } from "@/gen/networkbasetypes_pb.ts";

const REGISTRY = [
	netmessage_base,
	netmessage,
	usermessage,
	game_event,
	citadel_gameevent,
	citadel_usermessage,
	temp_entity,
] as const;

export class PacketParsingError extends Error {
	constructor(
		message: string,
		public readonly cursor: number,
		public readonly remainingBytes: number,
		public readonly type?: number,
		public readonly size?: number
	) {
		super(message);
		this.name = "PacketParsingError";
	}
}

export class DemoPacket {
	readonly #type: number;
	readonly #size: number;
	readonly #data: Uint8Array;
	static readonly #registry = REGISTRY;

	private constructor(type: number, size: number, data: Uint8Array) {
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

	public static from(bitbuffer: BitBuffer): DemoPacket {
		// Check if we have enough data to read at least the header
		if (bitbuffer.remaining_bytes() < 1) {
			throw new PacketParsingError(
				`Not enough data to read packet header. Remaining: ${bitbuffer.remaining_bytes()} bytes`,
				bitbuffer.cursor,
				bitbuffer.remaining_bytes()
			);
		}

		const type: number = bitbuffer.read_uvarbit();

		if (type === NET_Messages.net_NOP) {
			// keeping size incase its a hint for the next packet, but in reality its just a NOP and its either 0 or remaining bits
			return new DemoPacket(
				type,
				0,
				// bitbuffer.read_bits(bitbuffer.remaining_bits())
				new Uint8Array(0)
			);
		}
		const size = bitbuffer.read_uvarint32();

		// Validate size is reasonable
		if (size < 0 || size > bitbuffer.remaining_bytes()) {
			throw new PacketParsingError(
				`Invalid packet size: ${size} bytes. Remaining buffer: ${bitbuffer.remaining_bytes()} bytes. Buffer may be corrupted.`,
				bitbuffer.cursor,
				bitbuffer.remaining_bytes(),
				type,
				size
			);
		}

		const data = bitbuffer.read_bytes(size);

		return new DemoPacket(type, size, data);
	}

	public decode(): (typeof REGISTRY)[number]["decode"] {
		for (const registry of DemoPacket.#registry) {
			const type = this.#type;
			if (registry.isType(type)) {
				//@ts-expect-error
				return registry.decode(type, this.#data);
			}
		}
		throw new Error(`Unknown packet type: ${this.#type}`);
	}
}
