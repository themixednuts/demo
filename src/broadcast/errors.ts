export class BroadcastChunkError extends Error {
  constructor(
    message: string,
    public readonly code: BroadcastChunkErrorCode,
    public readonly offset?: number,
  ) {
    super(message);
    this.name = "BroadcastChunkError";
  }
}

export enum BroadcastChunkErrorCode {
  INSUFFICIENT_HEADER_DATA = "INSUFFICIENT_HEADER_DATA",
  INVALID_VARINT = "INVALID_VARINT",
  INSUFFICIENT_CHUNK_DATA = "INSUFFICIENT_CHUNK_DATA",
  MALFORMED_HEADER = "MALFORMED_HEADER",
}
