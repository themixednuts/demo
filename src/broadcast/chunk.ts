import { VarInt32 } from "@/data/varint32.ts";
import { EDemoCommands } from "@/gen/demo_pb.ts";
import { BroadcastChunkError, BroadcastChunkErrorCode } from "./errors.ts";
import * as Dem from "../decoders/dem.ts";

type ExtractCommandName<T extends string> = T extends `DEM_${infer Name}` ? Name
  : never;
type TypeGuardMethodName<T extends string> = `is${T}`;

/*
 * Helps with type guards for BroadcastChunk, making sure to stay in sync
 */
type BroadcastChunkTypeGuards = {
  [
    K in keyof typeof EDemoCommands as TypeGuardMethodName<
      ExtractCommandName<K>
    >
  ]: () => this is BroadcastChunk<typeof EDemoCommands[K]>;
};

export type BroadcastChunkHeader = {
  command: EDemoCommands;
  isCompressed: boolean;
  tick: number;
  size?: number;
  headerSize: number;
};

export class BroadcastChunk<K extends EDemoCommands = EDemoCommands>
  implements BroadcastChunkTypeGuards {
  #isCompressed: boolean;
  #command: K;
  #size?: number;
  #tick: number;
  #headerSize: number;
  #buffer: Uint8Array;

  private constructor(buffer: Uint8Array, header?: BroadcastChunkHeader) {
    const { command, isCompressed, tick, size, headerSize } = header ??
      BroadcastChunk.parseHeader(buffer);

    this.#isCompressed = isCompressed;
    this.#command = command as K;
    this.#tick = tick;
    this.#size = size;
    this.#headerSize = headerSize;
    this.#buffer = buffer.subarray(0, this.#headerSize + (this.#size ?? 0));
  }

  /**
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

  get command(): K {
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

  public decode(): Dem.DecoderReturnType[K] {
    return Dem.decode(this.#command, this.data ?? new Uint8Array());
  }

  public isFileHeader(): this is BroadcastChunk<EDemoCommands.DEM_FileHeader> {
    return this.#command === EDemoCommands.DEM_FileHeader;
  }

  public isFileInfo(): this is BroadcastChunk<EDemoCommands.DEM_FileInfo> {
    return this.#command === EDemoCommands.DEM_FileInfo;
  }

  public isSyncTick(): this is BroadcastChunk<EDemoCommands.DEM_SyncTick> {
    return this.#command === EDemoCommands.DEM_SyncTick;
  }

  public isSendTables(): this is BroadcastChunk<EDemoCommands.DEM_SendTables> {
    return this.#command === EDemoCommands.DEM_SendTables;
  }

  public isPacket(): this is BroadcastChunk<EDemoCommands.DEM_Packet> {
    return this.#command === EDemoCommands.DEM_Packet;
  }

  public isSignonPacket(): this is BroadcastChunk<
    EDemoCommands.DEM_SignonPacket
  > {
    return this.#command === EDemoCommands.DEM_SignonPacket;
  }

  public isConsoleCmd(): this is BroadcastChunk<EDemoCommands.DEM_ConsoleCmd> {
    return this.#command === EDemoCommands.DEM_ConsoleCmd;
  }

  public isCustomData(): this is BroadcastChunk<EDemoCommands.DEM_CustomData> {
    return this.#command === EDemoCommands.DEM_CustomData;
  }

  public isCustomDataCallback(): this is BroadcastChunk<
    EDemoCommands.DEM_CustomDataCallbacks
  > {
    return this.#command === EDemoCommands.DEM_CustomDataCallbacks;
  }

  public isUserCmd(): this is BroadcastChunk<EDemoCommands.DEM_UserCmd> {
    return this.#command === EDemoCommands.DEM_UserCmd;
  }

  public isFullPacket(): this is BroadcastChunk<EDemoCommands.DEM_FullPacket> {
    return this.#command === EDemoCommands.DEM_FullPacket;
  }

  public isSaveGame(): this is BroadcastChunk<EDemoCommands.DEM_SaveGame> {
    return this.#command === EDemoCommands.DEM_SaveGame;
  }

  public isSpawnGroups(): this is BroadcastChunk<
    EDemoCommands.DEM_SpawnGroups
  > {
    return this.#command === EDemoCommands.DEM_SpawnGroups;
  }

  public isAnimationData(): this is BroadcastChunk<
    EDemoCommands.DEM_AnimationData
  > {
    return this.#command === EDemoCommands.DEM_AnimationData;
  }

  public isAnimationHeader(): this is BroadcastChunk<
    EDemoCommands.DEM_AnimationHeader
  > {
    return this.#command === EDemoCommands.DEM_AnimationHeader;
  }

  public isRecovery(): this is BroadcastChunk<EDemoCommands.DEM_Recovery> {
    return this.#command === EDemoCommands.DEM_Recovery;
  }

  public isMax(): this is BroadcastChunk<EDemoCommands.DEM_Max> {
    return this.#command === EDemoCommands.DEM_Max;
  }

  public isIsCompressed(): this is BroadcastChunk<
    EDemoCommands.DEM_IsCompressed
  > {
    return this.#command === EDemoCommands.DEM_IsCompressed;
  }

  public isError(): this is BroadcastChunk<EDemoCommands.DEM_Error> {
    return this.#command === EDemoCommands.DEM_Error;
  }

  public isStop(): this is BroadcastChunk<EDemoCommands.DEM_Stop> {
    return this.#command === EDemoCommands.DEM_Stop;
  }

  public isClassInfo(): this is BroadcastChunk<EDemoCommands.DEM_ClassInfo> {
    return this.#command === EDemoCommands.DEM_ClassInfo;
  }

  public isStringTables(): this is BroadcastChunk<
    EDemoCommands.DEM_StringTables
  > {
    return this.#command === EDemoCommands.DEM_StringTables;
  }

  public isCustomDataCallbacks(): this is BroadcastChunk<
    EDemoCommands.DEM_CustomDataCallbacks
  > {
    return this.#command === EDemoCommands.DEM_CustomDataCallbacks;
  }
}
