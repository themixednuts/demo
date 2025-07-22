import { BroadcastChunk } from "./chunk.ts";

export class BroadcastFragment {
	#buffer: Uint8Array;

	private constructor(buffer: Uint8Array) {
		this.#buffer = buffer;
	}

	/**
	 * Creates a new BroadcastFragment from a buffer.
	 *
	 * @param buffer The buffer to create the fragment from.
	 * @returns The created BroadcastFragment.
	 */
	public static from(buffer: Uint8Array | ArrayBuffer): BroadcastFragment {
		return new BroadcastFragment(
			buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer
		);
	}

	/**
	 * Returns the size of the fragment in bytes.
	 */
	get size(): number {
		return this.#buffer.byteLength;
	}

	get buffer(): Uint8Array {
		return this.#buffer;
	}

	/**
	 * Returns an iterator over the chunks of the fragment.
	 */
	public *chunks(): Generator<BroadcastChunk> {
		let cursor = 0;

		while (cursor < this.#buffer.length) {
			const buffer = this.#buffer.subarray(cursor);
			const chunk = BroadcastChunk.from(buffer);
			yield chunk;
			cursor += chunk.size;
		}
	}
}
