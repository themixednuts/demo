/// <reference types="npm:@types/deno" />

import { BroadcastFragment } from '@/broadcast/fragment.ts';
import { EDemoCommands } from '@/gen/demo_pb.ts';
import { expect } from '@std/expect';

const TEST_FILES = [
	{ path: './tests/data/start.bin', name: 'Start Fragment' },
	{ path: './tests/data/full.bin', name: 'Full Fragment' },
	{ path: './tests/data/delta.bin', name: 'Delta Fragment' },
	{ path: './tests/data/delta.383.bin', name: 'Delta Frame 383 Fragment' },
] as const;

Deno.test('Demo Integration Test', async (t) => {
	for (const { path, name } of TEST_FILES) {
		await t.step(`BroadcastFragment parsing from ${name}`, async (t) => {
			const buffer = await Deno.readFile(path);
			const fragment = BroadcastFragment.from(buffer);

			await t.step('fragment should be valid', () => {
				expect(fragment).toBeDefined();
				expect(fragment.size).toBeGreaterThan(0);
				expect(fragment.buffer.byteLength).toBeGreaterThan(0);
			});

			await t.step('chunks should be accessible', () => {
				expect(fragment.chunks()).toBeDefined();
			});

			await t.step('all chunks should have valid headers', () => {
				const chunks = fragment.chunks();

				for (const chunk of chunks) {
					expect(Object.values(EDemoCommands)).toContain(chunk.command);
					expect(chunk.isValid()).toBe(true);
					expect(chunk.size).toBeGreaterThan(0);
					expect(chunk.buffer.byteLength).toBeGreaterThan(0);
				}
			});

			await t.step('all chunks should parse correctly', () => {
				const chunks = fragment.chunks();

				for (const chunk of chunks) {
					expect(chunk.isCompressed).toBe(false);

					const data = chunk.data;
					expect(data).toBeDefined();
					if (chunk.isPacket()) {
						const decoded = chunk.decode();
						for (const packet of decoded) {
							packet.decode();
							expect(packet).toBeDefined();
						}
					}
				}
			});
		});
	}
});
