import { VarInt32 } from "@/data/varint32";
import { EDemoCommands } from "@/gen/demo_pb";
import { BroadcastChunkError, BroadcastChunkErrorCode } from "./errors";

export type BroadcastChunkHeader = {
  command: EDemoCommands;
  isCompressed: boolean;
  tick: number;
  size?: number;
  headerSize: number;
};

export class BroadcastChunk {
  #isCompressed: boolean;
  #command: EDemoCommands;
  #size?: number;
  #tick: number;
  #headerSize: number;
  #buffer: Uint8Array;

  private constructor(buffer: Uint8Array, header?: BroadcastChunkHeader) {
    const { command, isCompressed, tick, size, headerSize } =
      header ?? BroadcastChunk.parseHeader(buffer);

    this.#isCompressed = isCompressed;
    this.#command = command;
    this.#tick = tick;
    this.#size = size;
    this.#headerSize = headerSize;
    this.#buffer = buffer.subarray(0, this.#headerSize + (this.#size ?? 0));
  }

  /**
   *
   * @param buffer
   * @returns
   */
  public static from(buffer: Uint8Array | ArrayBuffer): BroadcastChunk {
    return new BroadcastChunk(
      buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer,
    );
  }

  /**
   * Parses the header from a buffer.
   * @param buffer - The buffer to parse the header from
   * @returns The parsed header
   * @throws {BroadcastChunkError} When the buffer is too small or malformed
   */
  public static parseHeader(buffer: Uint8Array): BroadcastChunkHeader {
    if (buffer.length < 6) {
      console.log(buffer);
      throw new BroadcastChunkError(
        `Buffer too small header: ${buffer.length} bytes, minimum 6 bytes to read initial chunk and tick`,
        BroadcastChunkErrorCode.INSUFFICIENT_HEADER_DATA,
        buffer.byteOffset,
      );
    }

    const view = new DataView(buffer.buffer, buffer.byteOffset);
    const { value, size: bytesRead } = VarInt32.parse(buffer);
    const isCompressed = (value & EDemoCommands.DEM_IsCompressed) !== 0;
    const command = isCompressed
      ? value & ~EDemoCommands.DEM_IsCompressed
      : value;

    const tick = view.getUint32(bytesRead, true);
    const isFinal = command === EDemoCommands.DEM_Stop;
    if (!isFinal && buffer.length < 10) {
      throw new BroadcastChunkError(
        `Buffer too small for chunk header: ${buffer.length} bytes, minimum 10 bytes to read chunk header`,
        BroadcastChunkErrorCode.INSUFFICIENT_HEADER_DATA,
        buffer.byteOffset,
      );
    }

    const size = isFinal ? undefined : view.getUint32(bytesRead + 4 + 1, true);
    const headerSize = isFinal ? bytesRead + 4 + 1 : bytesRead + 4 + 1 + 4;

    return {
      command,
      isCompressed,
      tick,
      size,
      headerSize,
    };
  }

  public static withHeader(
    buffer: Uint8Array,
    header: BroadcastChunkHeader,
  ): BroadcastChunk {
    return new BroadcastChunk(buffer, header);
  }

  public header(): BroadcastChunkHeader {
    return {
      command: this.#command,
      isCompressed: this.#isCompressed,
      tick: this.#tick,
      size: this.#size,
      headerSize: this.#headerSize,
    };
  }

  get isCompressed(): boolean {
    return this.#isCompressed;
  }

  get tick(): number {
    return this.#tick;
  }

  get command(): EDemoCommands {
    return this.#command;
  }

  get size(): number {
    return this.#headerSize + (this.#size ?? 0);
  }

  get buffer(): Uint8Array {
    return this.#buffer;
  }

  public get data(): Uint8Array | undefined {
    if (!this.#size) return undefined;

    return this.#buffer.subarray(
      this.#headerSize,
      this.#headerSize + this.#size,
    );
  }

  public isValid(): boolean {
    const data = this.data;
    return !data || data.length === this.#size;
  }
}
