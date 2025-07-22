export class VarInt32 {
  private constructor(
    /** The value of the VarInt32 */
    public readonly value: number,
    /** The number of bytes used to encode the value */
    public readonly size: number,
  ) {}

  static MAX_BYTES = 5;
  static parse(buffer: Uint8Array) {
    let offset = 0;
    let value = 0;

    while (offset < VarInt32.MAX_BYTES) {
      if (offset >= buffer.length) {
        throw new Error("Invalid buffer");
      }
      const byte = buffer[offset];
      value |= (byte & 0x7f) << (7 * offset);
      offset++;

      if ((byte & 0x80) === 0) {
        break;
      }
    }

    return new VarInt32(value, offset);
  }
}
