export interface Vector {
	x: number;
	y: number;
	z: number;
}

export type Result<T, E = Error> =
	| { ok: true; value: T }
	| { ok: false; error: E };

export function Ok<T>(value: T): Result<T> {
	return { ok: true, value };
}

export function Err<E>(error: E): Result<never, E> {
	return { ok: false, error };
}

export class BitBufferError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "BitBufferError";
	}
}

export class BitBuffer {
	private static readonly BITS_PER_BYTE = 8;
	private static readonly BIT_MASKS = new Uint8Array([
		0, // 0 bits
		1, // 1 bit:  0b00000001
		3, // 2 bits: 0b00000011
		7, // 3 bits: 0b00000111
		15, // 4 bits: 0b00001111
		31, // 5 bits: 0b00011111
		63, // 6 bits: 0b00111111
		127, // 7 bits: 0b01111111
		255, // 8 bits: 0b11111111
	]);
	// private readonly view: DataView;
	readonly buffer: Uint8Array;
	cursor = 0;

	private constructor(data: Uint8Array | ArrayBuffer | number[]) {
		if (data instanceof ArrayBuffer) {
			this.buffer = new Uint8Array(data);
		} else if (Array.isArray(data)) {
			this.buffer = new Uint8Array(data);
		} else {
			this.buffer = data;
		}
	}

	public static from(data: Uint8Array | ArrayBuffer | number[]): BitBuffer {
		return new BitBuffer(data);
	}

	public static new(size: number): BitBuffer {
		return new BitBuffer(new Uint8Array(size));
	}

	public length(): number {
		return this.buffer.length * BitBuffer.BITS_PER_BYTE;
	}

	public is_empty(): boolean {
		return this.buffer.length === 0;
	}

	public byteOffset(): number {
		return Math.floor(this.cursor / BitBuffer.BITS_PER_BYTE);
	}

	public remaining_bits(): number {
		return this.buffer.length * BitBuffer.BITS_PER_BYTE - this.cursor;
	}

	public remaining_bytes(): number {
		return Math.floor(this.remaining_bits() / BitBuffer.BITS_PER_BYTE);
	}

	private check_bounds(bits: number): Result<void, BitBufferError> {
		if (bits > this.remaining_bits()) {
			return Err(
				new BitBufferError(
					`Cannot read ${bits} bits, only ${this.remaining_bits()} available`
				)
			);
		}
		return Ok(undefined);
	}

	private bit_index(): number {
		return this.cursor % BitBuffer.BITS_PER_BYTE;
	}

	private byte_index(): number {
		return Math.floor(this.cursor / BitBuffer.BITS_PER_BYTE);
	}

	public try_read_bit(): Result<boolean, BitBufferError> {
		const bit = this.try_read_bits(1);
		if (!bit.ok) return bit;
		const view = new DataView(bit.value.buffer, bit.value.byteOffset);
		const byte = view.getUint8(0);
		return Ok(byte === 1);
	}

	public read_bit(): boolean {
		const result = this.try_read_bit();
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_bits(bits: number): Result<Uint8Array, BitBufferError> {
		if (bits === 0) return Ok(new Uint8Array(0));

		const bounds_check = this.check_bounds(bits);
		if (!bounds_check.ok) return bounds_check;

		const result = new Uint8Array(Math.ceil(bits / 8));
		let bits_read = 0;

		while (bits_read < bits) {
			const byte_index = this.byte_index();
			const bit_index = this.bit_index();
			const bits_in_current_byte = BitBuffer.BITS_PER_BYTE - bit_index;
			const bits_to_read = Math.min(bits - bits_read, bits_in_current_byte);

			const byte = this.buffer[byte_index];
			const mask = BitBuffer.BIT_MASKS[bits_to_read];
			const value = (byte >> bit_index) & mask;

			// Calculate where to put these bits in the result buffer
			const result_byte_index = Math.floor(bits_read / 8);
			const result_bit_index = bits_read % 8;

			result[result_byte_index] |= value << result_bit_index;

			// If the value spills over into the next byte, handle the overflow
			if (result_bit_index + bits_to_read > 8) {
				result[result_byte_index + 1] |= value >> (8 - result_bit_index);
			}

			bits_read += bits_to_read;
			this.cursor += bits_to_read;
		}

		return Ok(result);
	}

	public read_bits(bits: number): Uint8Array {
		const result = this.try_read_bits(bits);
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_u8(): Result<number, BitBufferError> {
		const result = this.try_read_bits(BitBuffer.BITS_PER_BYTE);
		if (!result.ok) return result;
		const view = new DataView(result.value.buffer);
		const value = view.getUint8(0);
		return Ok(value);
	}

	public read_u8(): number {
		const result = this.try_read_u8();
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_u16(): Result<number, BitBufferError> {
		const result = this.try_read_bits(16);
		if (!result.ok) return result;
		const view = new DataView(result.value.buffer);
		const value = view.getUint16(0);
		return Ok(value);
	}

	public read_u16(): number {
		const result = this.try_read_u16();
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_u32(): Result<number, BitBufferError> {
		const result = this.try_read_bits(32);
		if (!result.ok) return result;
		const view = new DataView(result.value.buffer);
		const value = view.getUint32(0);
		return Ok(value);
	}

	public read_u32(): number {
		const result = this.try_read_u32();
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_uvarint32(): Result<number, BitBufferError> {
		let result = 0;
		let shift = 0;
		let byte: number;

		do {
			const byte_result = this.try_read_u8();
			if (!byte_result.ok) return byte_result;
			byte = byte_result.value;

			result |= (byte & 0x7f) << shift;
			shift += 7;
		} while ((byte & 0x80) !== 0);

		return Ok(result >>> 0);
	}

	public read_uvarint32(): number {
		const result = this.try_read_uvarint32();
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_varint32(): Result<number, BitBufferError> {
		const unsigned_result = this.try_read_uvarint32();
		if (!unsigned_result.ok) return unsigned_result;

		const unsigned = unsigned_result.value >>> 0;
		return Ok((unsigned >>> 1) ^ -(unsigned & 1));
	}

	public read_varint32(): number {
		const result = this.try_read_varint32();
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_uvarint64(): Result<bigint, BitBufferError> {
		let result = 0n;
		let shift = 0n;
		let byte: number;

		do {
			const byte_result = this.try_read_u8();
			if (!byte_result.ok) return byte_result;
			byte = byte_result.value;

			result |= BigInt(byte & 0x7f) << shift;
			shift += 7n;
		} while ((byte & 0x80) !== 0);

		return Ok(result);
	}

	public read_uvarint64(): bigint {
		const result = this.try_read_uvarint64();
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_varint64(): Result<bigint, BitBufferError> {
		const unsigned_result = this.try_read_uvarint64();
		if (!unsigned_result.ok) return unsigned_result;

		const unsigned = unsigned_result.value;
		return Ok((unsigned >> 1n) ^ -(unsigned & 1n));
	}

	public read_varint64(): bigint {
		const result = this.try_read_varint64();
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_uvarbit(): Result<number, BitBufferError> {
		const initial_result = this.try_read_bits(6);
		if (!initial_result.ok) return initial_result;

		const view = new DataView(initial_result.value.buffer);

		let result = view.getUint8(0);

		switch (result & 48) {
			case 16: {
				const value_result = this.try_read_bits(4);
				if (!value_result.ok) return value_result;
				const view = new DataView(value_result.value.buffer);
				const value = view.getUint8(0);
				result = (result & 15) | (value << 4);
				break;
			}
			case 32: {
				const value_result = this.try_read_bits(8);
				if (!value_result.ok) return value_result;
				const view = new DataView(value_result.value.buffer);
				const value = view.getUint8(0);
				result = (result & 15) | (value << 4);
				break;
			}
			case 48: {
				const value_result = this.try_read_bits(28);
				if (!value_result.ok) return value_result;

				const view = new DataView(value_result.value.buffer);
				const value = view.getUint8(0);
				result = (result & 15) | (value << 4);
				break;
			}
		}

		return Ok(result >>> 0);
	}

	public read_uvarbit(): number {
		const result = this.try_read_uvarbit();
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_f32(): Result<number, BitBufferError> {
		const bits_result = this.try_read_bits(32);
		if (!bits_result.ok) return bits_result;

		const bits = bits_result.value;
		const view = new DataView(bits.buffer);
		return Ok(view.getFloat32(0, true));
	}

	public read_f32(): number {
		const result = this.try_read_f32();
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_string(max_length?: number): Result<string, BitBufferError> {
		const bytes: number[] = [];
		let length = 0;

		while (this.remaining_bits() >= 8) {
			if (max_length !== undefined && length >= max_length) {
				break;
			}

			const byte_result = this.try_read_u8();
			if (!byte_result.ok) return byte_result;

			const byte = byte_result.value;
			if (byte === 0) {
				break;
			}

			bytes.push(byte);
			length++;
		}

		return Ok(new TextDecoder().decode(new Uint8Array(bytes)));
	}

	public read_string(max_length?: number): string {
		const result = this.try_read_string(max_length);
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_read_bytes(count: number): Result<Uint8Array, BitBufferError>;
	public try_read_bytes(buffer: Uint8Array): Result<Uint8Array, BitBufferError>;
	public try_read_bytes(
		count_or_buffer: number | Uint8Array
	): Result<Uint8Array, BitBufferError> {
		if (typeof count_or_buffer === "number") {
			const count = count_or_buffer;
			const bounds_check = this.check_bounds(count * BitBuffer.BITS_PER_BYTE);
			if (!bounds_check.ok) return bounds_check;

			// Optimize for byte-aligned reads
			if (this.is_aligned() && count > 0) {
				const byte_offset = this.cursor / BitBuffer.BITS_PER_BYTE;
				const result = this.buffer.subarray(byte_offset, byte_offset + count);
				this.cursor += count * BitBuffer.BITS_PER_BYTE;

				return Ok(result.slice()); // Return a copy
			} else {
				// Fall back to bit-by-bit reading
				const result = new Uint8Array(count);
				for (let i = 0; i < count; i++) {
					const byte_result = this.try_read_u8();
					if (!byte_result.ok) return byte_result;
					result[i] = byte_result.value;
				}

				return Ok(result);
			}
		} else {
			const buffer = count_or_buffer;
			const count = buffer.length;
			const bounds_check = this.check_bounds(count * BitBuffer.BITS_PER_BYTE);
			if (!bounds_check.ok) return bounds_check;

			// Optimize for byte-aligned reads
			if (this.is_aligned() && count > 0) {
				const byte_offset = this.cursor / BitBuffer.BITS_PER_BYTE;
				const source_bytes = this.buffer.subarray(
					byte_offset,
					byte_offset + count
				);
				buffer.set(source_bytes);
				this.cursor += count * BitBuffer.BITS_PER_BYTE;

				return Ok(buffer);
			} else {
				// Fall back to bit-by-bit reading
				for (let i = 0; i < count; i++) {
					const byte_result = this.try_read_u8();
					if (!byte_result.ok) return byte_result;
					buffer[i] = byte_result.value;
				}

				return Ok(buffer);
			}
		}
	}

	public read_bytes(count: number): Uint8Array;
	public read_bytes(buffer: Uint8Array): Uint8Array;
	public read_bytes(count_or_buffer: number | Uint8Array): Uint8Array {
		const result =
			typeof count_or_buffer === "number"
				? this.try_read_bytes(count_or_buffer)
				: this.try_read_bytes(count_or_buffer);
		if (!result.ok) throw result.error;
		return result.value;
	}

	public try_skip(bits: number): Result<void, BitBufferError> {
		const bounds_check = this.check_bounds(bits);
		if (!bounds_check.ok) return bounds_check;
		this.cursor += bits;
		return Ok(undefined);
	}

	public skip(bits: number): void {
		const result = this.try_skip(bits);
		if (!result.ok) throw result.error;
	}

	public try_seek(bit_position: number): Result<void, BitBufferError> {
		if (
			bit_position < 0 ||
			bit_position > this.buffer.length * BitBuffer.BITS_PER_BYTE
		) {
			return Err(new BitBufferError(`Invalid bit position: ${bit_position}`));
		}
		this.cursor = bit_position;
		return Ok(undefined);
	}

	public seek(bit_position: number): void {
		const result = this.try_seek(bit_position);
		if (!result.ok) throw result.error;
	}

	public reset(): void {
		this.cursor = 0;
	}

	public is_aligned(): boolean {
		return this.cursor % BitBuffer.BITS_PER_BYTE === 0;
	}

	public align_to_byte(): void {
		const remainder = this.cursor % BitBuffer.BITS_PER_BYTE;
		if (remainder !== 0) {
			this.skip(BitBuffer.BITS_PER_BYTE - remainder);
		}
	}

	public clone(): BitBuffer {
		const cloned = new BitBuffer(this.buffer);
		cloned.cursor = this.cursor;
		return cloned;
	}

	public as_slice(): Uint8Array {
		return this.buffer.slice();
	}

	public as_ref(): Uint8Array {
		return this.buffer;
	}
}
