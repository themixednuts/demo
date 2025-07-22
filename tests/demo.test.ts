import { describe, expect, test } from "vitest";
import { BitBuffer } from "@/buffers/bit";
import { BroadcastFragment } from "@/broadcast/fragment";
import { EDemoCommands } from "@/gen/demo_pb";
import { DemoPacket, PacketParsingError } from "@/parser";
import { decode } from "@/decoders/dem";
import { NET_Messages } from "@/gen/networkbasetypes_pb";

describe("Demo", () => {
  describe("Broadcast Fragment", () => {
    describe("Start Fragment, Frame 0", async () => {
      const buffer = await Deno.readFile("./tests/data/start.bin");
      const fragment = BroadcastFragment.from(buffer);
      test("should be defined", () => {
        expect(fragment).toBeDefined();
        expect(fragment.size).toBeGreaterThan(0);
      });
      test("FragmentChunk should be defined", () => {
        expect(fragment.chunks()).toBeDefined();
      });
      test("FragmentChunks should have correct headers", () => {
        for (const chunk of fragment.chunks()) {
          expect(Object.values(EDemoCommands)).toContain(chunk.command);
          expect(chunk.isValid()).toBe(true);
          expect(chunk.size).toBeGreaterThan(0);
          expect(chunk.buffer.byteLength).toBeGreaterThan(0);
        }
      });
      test("FragmentChunks should parse with Protobuf Mapper", () => {
        for (const chunk of fragment.chunks()) {
          expect(chunk.isCompressed).toBe(false);

          const data = chunk.data;
          expect(data).toBeDefined();

          if (!data) {
            continue;
          }

          // Only parse network packets for chunk types that actually contain them
          const networkPacketChunks = [
            EDemoCommands.DEM_Packet,
            EDemoCommands.DEM_SignonPacket,
            EDemoCommands.DEM_FullPacket,
          ];

          if (!networkPacketChunks.includes(chunk.command)) {
            const message = decode(chunk.command, data);
            console.log(message);
            continue;
          }

          const bitbuffer = BitBuffer.from(data);

          while (bitbuffer.remaining_bytes() > 0) {
            try {
              const packet = DemoPacket.from(bitbuffer);

              if (packet.type === NET_Messages.net_NOP) break;

              expect(packet).toBeDefined();
              expect(packet.size).toBeGreaterThanOrEqual(0);
            } catch (error) {
              if (error instanceof PacketParsingError) {
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
                  rawBytes: Array.from(
                    bitbuffer.buffer.slice(bitbuffer.byteOffset()),
                  ).map((byte) => byte.toString(16).padStart(2, "0")),
                });
              } else {
                console.error("Unexpected error:", error);
                console.log({
                  remaining_bytes: bitbuffer.remaining_bytes(),
                  remaining_bits: bitbuffer.remaining_bits(),
                  cursor: bitbuffer.cursor,
                  slice: Array.from(
                    bitbuffer.buffer.slice(bitbuffer.byteOffset()),
                  ).map((byte) => byte.toString(16).padStart(2, "0")),
                });
              }
              throw error;
            }
          }
        }
      });
    });
  });
});
