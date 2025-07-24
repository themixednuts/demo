/// <reference types="npm:@types/deno" />

import { BroadcastFragment } from "@/broadcast/fragment.ts";
import { BitBuffer } from "@/buffers/bit.ts";
import { decode } from "@/decoders/dem.ts";
import { EDemoCommands } from "@/gen/demo_pb.ts";
import { NET_Messages } from "@/gen/networkbasetypes_pb.ts";
import { DemoPacket, PacketParsingError } from "@/packet.ts";
import { expect } from "@std/expect";
import type { BroadcastChunk } from "@/broadcast/mod.ts";
import { SVC_Messages } from "@/gen/netmessages_pb.ts";

const NETWORK_PACKET_COMMANDS = [
  EDemoCommands.DEM_Packet,
  EDemoCommands.DEM_SignonPacket,
  EDemoCommands.DEM_FullPacket,
  EDemoCommands.DEM_SpawnGroups,
] as const;

function logParsingError(
  error: PacketParsingError,
  bitbuffer: BitBuffer,
): void {
  console.error(`PacketParsingError: ${error.message}`);
  console.log({
    errorDetails: {
      cursor: error.cursor,
      remainingBytes: error.remainingBytes,
      type: error.type,
      size: error.size,
    },
    bufferState: {
      remaining_bytes: bitbuffer.remaining_bytes(),
      remaining_bits: bitbuffer.remaining_bits(),
      cursor: bitbuffer.cursor,
    },
    rawBytes: Array.from(bitbuffer.buffer.slice(bitbuffer.byteOffset()))
      .map((byte) => byte.toString(16).padStart(2, "0")),
  });
}

function logUnexpectedError(error: unknown, bitbuffer: BitBuffer): void {
  console.error("Unexpected error:", error);
  console.log({
    bufferState: {
      remaining_bytes: bitbuffer.remaining_bytes(),
      remaining_bits: bitbuffer.remaining_bits(),
      cursor: bitbuffer.cursor,
    },
    rawBytes: Array.from(bitbuffer.buffer.slice(bitbuffer.byteOffset()))
      .map((byte) => byte.toString(16).padStart(2, "0")),
  });
}

const TEST_FILES = [
  { path: "./tests/data/start.bin", name: "Start Fragment" },
  { path: "./tests/data/full.bin", name: "Full Fragment" },
  { path: "./tests/data/delta.bin", name: "Delta Fragment" },
  { path: "./tests/data/delta.383.bin", name: "Delta Frame 383 Fragment" },
] as const;

Deno.test("Demo Integration Test", async (t) => {
  for (const { path, name } of TEST_FILES) {
    await t.step(`BroadcastFragment parsing from ${name}`, async (t) => {
      const buffer = await Deno.readFile(path);
      const fragment = BroadcastFragment.from(buffer);

      await t.step("fragment should be valid", () => {
        expect(fragment).toBeDefined();
        expect(fragment.size).toBeGreaterThan(0);
        expect(fragment.buffer.byteLength).toBeGreaterThan(0);
      });

      await t.step("chunks should be accessible", () => {
        expect(fragment.chunks()).toBeDefined();
      });

      await t.step("all chunks should have valid headers", () => {
        const chunks = fragment.chunks();

        for (const chunk of chunks) {
          expect(Object.values(EDemoCommands)).toContain(chunk.command);
          expect(chunk.isValid()).toBe(true);
          expect(chunk.size).toBeGreaterThan(0);
          expect(chunk.buffer.byteLength).toBeGreaterThan(0);
        }
      });

      await t.step("all chunks should parse correctly", () => {
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
