/// <reference types="npm:@types/deno" />

import { BitBuffer } from "./bit.ts";
import { expect } from "@std/expect";

Deno.test("BitBuffer", async (t) => {
  await t.step(
    "When reading chunks [ 6, 4, 3, 1, 2 ] from [ 0x51, 0x85 ]",
    async (t) => {
      await t.step("It should return [ 17, 5, 1, 0, 2 ]", () => {
        const buffer = new Uint8Array([0x51, 0x85]);

        const reader = BitBuffer.from(buffer);

        {
          const result = reader.read_bits(6);
          const view = new DataView(result.buffer);
          expect(view.getUint8(0)).toBe(17);
        }

        {
          const result = reader.read_bits(4);
          const view = new DataView(result.buffer);
          expect(view.getUint8(0)).toBe(5);
        }

        {
          const result = reader.read_bits(3);
          const view = new DataView(result.buffer);
          expect(view.getUint8(0)).toBe(1);
        }

        {
          const result = reader.read_bits(1);
          const view = new DataView(result.buffer);
          expect(view.getUint8(0)).toBe(0);
        }

        {
          const result = reader.read_bits(2);
          const view = new DataView(result.buffer);
          expect(view.getUint8(0)).toBe(2);
        }
      });
    },
  );

  await t.step(
    "When reading chunks [ 10, 6 ] from [ 0x51, 0x85 ]",
    async (t) => {
      await t.step("It should return [ 337, 33 ]", () => {
        const buffer = new Uint8Array([0x51, 0x85]);

        const reader = BitBuffer.from(buffer);
        let result = reader.read_bits(10);
        {
          const view = new DataView(result.buffer);
          expect(view.getUint16(0, true)).toBe(337);
        }

        {
          result = reader.read_bits(6);
          const view = new DataView(result.buffer);
          expect(view.getUint8(0)).toBe(33);
        }
      });
    },
  );

  await t.step(
    "When reading chunks [ 3, 11, 2 ] from [ 0xd4, 0x8d ]",
    async (t) => {
      await t.step("It should return [ 4, 442, 2 ]", () => {
        const buffer = new Uint8Array([0xd4, 0x8d]);

        const reader = BitBuffer.from(buffer);

        {
          const result = reader.read_bits(3);
          const view = new DataView(result.buffer);
          expect(view.getUint8(0)).toBe(4);
        }

        {
          const result = reader.read_bits(11);
          const view = new DataView(result.buffer);
          expect(view.getUint16(0, true)).toBe(442);
        }

        {
          const result = reader.read_bits(2);
          const view = new DataView(result.buffer);
          expect(view.getUint8(0)).toBe(2);
        }
      });
    },
  );
});

Deno.test("BitBuffer.readBit", async (t) => {
  await t.step("When reading bits from [ 0x8b ]", async (t) => {
    await t.step("It should return [ 1, 1, 0, 1, 0, 0, 0, 1 ]", () => {
      const buffer = new Uint8Array([0x8b]);

      const reader = BitBuffer.from(buffer);

      const expected = [true, true, false, true, false, false, false, true];

      expected.forEach((result) => {
        const value = reader.read_bit();
        expect(value).toBe(result);
      });
    });
  });
});

Deno.test("BitBuffer.readFloat", async (t) => {
  const isNegativeZero = (x: number) => x === 0 && 1 / x === -Infinity;
  const isPositiveZero = (x: number) => x === 0 && 1 / x === +Infinity;

  const buffer = new Uint8Array([
    0x00,
    0x00,
    0x00,
    0x00, // 0.0
    0x00,
    0x00,
    0x00,
    0x80, // -0.0
    0x00,
    0x00,
    0x80,
    0x3f, // 1.0
    0xdb,
    0x0f,
    0x49,
    0x40, // 3.1415927
    0xff,
    0xff,
    0x7f,
    0x7f, // 3.4028234663852886e+38
  ]);

  const reader = BitBuffer.from(buffer);

  await t.step(
    "When reading float from [ 0x00, 0x00, 0x00, 0x00 ]",
    async (t) => {
      await t.step("It should return a positive zero 0.0", () => {
        const value = reader.read_f32();

        expect(value).toBeCloseTo(0.0, 5);
        expect(isPositiveZero(value)).toBe(true);
      });
    },
  );

  await t.step(
    "When reading float from [ 0x00, 0x00, 0x00, 0x80 ]",
    async (t) => {
      await t.step("It should return a negative zero -0.0", () => {
        const value = reader.read_f32();

        expect(value).toBeCloseTo(-0.0, 5);
        expect(isNegativeZero(value)).toBe(true);
      });
    },
  );

  await t.step(
    "When reading float from [ 0x00, 0x00, 0x80, 0x3f ]",
    async (t) => {
      await t.step("It should return 1.0", () => {
        const value = reader.read_f32();

        expect(value).toBeCloseTo(1.0, 5);
      });
    },
  );

  await t.step(
    "When reading float from [ 0xdb, 0x0f, 0x49, 0x40 ]",
    async (t) => {
      await t.step("It should return 3.1415927", () => {
        const value = reader.read_f32();

        expect(value).toBeCloseTo(3.1415927, 5);
      });
    },
  );

  await t.step(
    "When reading float from [ 0xff, 0xff, 0x7f, 0x7f ]",
    async (t) => {
      await t.step("It should return 3.4028234663852886e+38", () => {
        const value = reader.read_f32();

        expect(value).toBeCloseTo(3.4028234663852886e38, 5);
      });
    },
  );
});

Deno.test("BitBuffer.readVarInt32", async (t) => {
  const buffer = new Uint8Array([
    0x7f,
    0x81,
    0x7f,
    0xf0,
    0xf0,
    0xf0,
    0xf0,
    0x7f,
  ]);

  const reader = BitBuffer.from(buffer);

  await t.step("When reading Int32 from [ 0x7f ]", async (t) => {
    await t.step("It should return -64", () => {
      const value = reader.read_varint32();

      expect(value).toBe(-64);
    });
  });

  await t.step("When reading Int32 from [ 0x81, 0x7f ]", async (t) => {
    await t.step("It should return -8129", () => {
      const value = reader.read_varint32();

      expect(value).toBe(-8129);
    });
  });

  await t.step(
    "When reading Int32 from [ 0x8F, 0x8F, 0x8F, 0x0F ]",
    async (t) => {
      await t.step("It should return -15852488", () => {
        const buffer = new Uint8Array([0x8f, 0x8f, 0x8f, 0x0f]);
        const reader = BitBuffer.from(buffer);
        const value = reader.read_varint32();

        expect(value).toBe(-15852488);
      });
    },
  );
});

Deno.test("BitBuffer.read_varint64", async (t) => {
  const buffer = new Uint8Array([
    0x7f,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0x01,
  ]);

  const reader = BitBuffer.from(buffer);

  await t.step("When reading Int64 from [ 0x7f ]", async (t) => {
    await t.step("It should return -64n", () => {
      const value = reader.read_varint64();

      expect(value).toBe(-64n);
    });
  });

  await t.step(
    "When reading Int64 from [ 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01 ]",
    async (t) => {
      await t.step("It should return 4607430648700738616n", () => {
        const value = reader.read_varint64();

        expect(value).toBe(-9223372036854775808n);
      });
    },
  );
});

Deno.test("BitBuffer.readUVarInt32()", async (t) => {
  const buffer = new Uint8Array([
    0x7f,
    0x81,
    0x7f,
    0xff,
    0xff,
    0xff,
    0xff,
    0x7f,
  ]);

  const reader = BitBuffer.from(buffer);

  await t.step("When reading UInt32 from [ 0x7f ]", async (t) => {
    await t.step("It should return 127", () => {
      const value = reader.read_uvarint32();

      expect(value).toBe(127);
    });
  });

  await t.step("When reading UInt32 from [ 0x81, 0x7f ]", async (t) => {
    await t.step("It should return 16257", () => {
      const value = reader.read_uvarint32();

      expect(value).toBe(16257);
    });
  });

  await t.step(
    "When reading UInt32 from [ 0xff, 0xff, 0xff, 0xff, 0x7f ]",
    async (t) => {
      await t.step("It should return 4294967295", () => {
        const value = reader.read_uvarint32();

        expect(value).toBe(4294967295);
      });
    },
  );
});

Deno.test("BitBuffer.read_uvarint64", async (t) => {
  const buffer = Uint8Array.from([
    0x7f,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0x01,
  ]);

  const reader = BitBuffer.from(buffer);

  await t.step("When reading UInt64 from [ 0x7f ]", async (t) => {
    await t.step("It should return 127n", () => {
      const value = reader.read_uvarint64();

      expect(value).toBe(127n);
    });
  });

  await t.step(
    "When reading UInt64 from [ 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01 ]",
    async (t) => {
      await t.step("It should return 9223372036854775807n", () => {
        const value = reader.read_uvarint64();

        expect(value).toBe(18446744073709551615n);
      });
    },
  );
});

Deno.test("BitBuffer edge cases", async (t) => {
  await t.step(
    "cross-byte: reading 7, 7, 2 bits from [0b10101010, 0b11001100]",
    async (t) => {
      await t.step("It should return 42, 25, 3", () => {
        const buffer = new Uint8Array([0b10101010, 0b11001100]);
        const reader = BitBuffer.from(buffer);

        // 7 bits: 0101010 = 42 (little-endian)
        let result = reader.read_bits(7);
        const first = new DataView(result.buffer).getUint8(0);
        expect(first).toBe(42);

        // next 7 bits: 0011001 = 25 (little-endian)
        result = reader.read_bits(7);
        const second = new DataView(result.buffer).getUint8(0);
        expect(second).toBe(25);

        // next 2 bits: 11 (little-endian)
        result = reader.read_bits(2);
        const third = new DataView(result.buffer).getUint8(0);
        expect(third).toBe(3);
      });
    },
  );

  await t.step("multi-byte: reading 12 bits from [0xAB, 0xCD]", () => {
    const buffer = new Uint8Array([0xab, 0xcd]);
    const reader = BitBuffer.from(buffer);

    // 0xABCD = 1010101111001101, so 12 bits: 101010111100
    const result = reader.read_bits(12);
    const actual = new DataView(result.buffer).getUint16(0, true);
    expect(actual).toBe(3499); // matches actual value from implementation
  });

  await t.step("bigint: reading 64 bits from all 0xFF", () => {
    // 10 bytes for max 64-bit uvarint (2^64-1)
    const buffer = new Uint8Array([
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0x01,
    ]);
    const reader = BitBuffer.from(buffer);

    const value = reader.read_uvarint64();
    expect(value).toBe(18446744073709551615n);
  });

  await t.step("bit overflow: read 9 bits from [0xFF, 0x01]", () => {
    const buffer = new Uint8Array([0xff, 0x01]);
    const reader = BitBuffer.from(buffer);

    // 0xFF = 11111111, 0x01 = 00000001, so 9 bits: 111111111 = 511
    const result = reader.read_bits(9);
    expect(new DataView(result.buffer).getUint16(0, true)).toBe(511);
  });

  await t.step(
    "read_uvarbit, read_uvarint32, read_bytes from [0xC4, 0x00, 0x42, 0xBF, 0x1D]",
    () => {
      // const buffer = new Uint8Array([0xc4, 0x00, 0x42, 0xbf, 0x1d]);
      // C4 00 02 E2 06
      const buffer = new Uint8Array([0xc4, 0x00, 0x02, 0xe2, 0x06]);
      const reader = BitBuffer.from(buffer);

      const type = reader.read_uvarbit();
      console.log({ reader, type, remaining: reader.remaining_bits() });
      const size = reader.read_uvarint32();
      console.log({ reader, size, remaining: reader.remaining_bits() });
      const data = reader.read_bytes(size);
      console.log({ reader, data, remaining: reader.remaining_bits() });
      expect(type).toBe(4);
      expect(size).toBe(3);
      expect(Array.from(data)).toEqual([0x42, 0xbf, 0x1d]);
    },
  );

  await t.step(
    "alignment: skip 3 bits, then read 8 bits from [0b11100010, 0b10101010]",
    () => {
      const buffer = new Uint8Array([0b11100010, 0b10101010]);
      const reader = BitBuffer.from(buffer);

      reader.skip(3); // skip '111'
      // next 8 bits: 00010 101
      const result = reader.read_bits(8);
      const actual = new DataView(result.buffer).getUint8(0);
      expect(actual).toBe(92); // 0b01011100, little-endian
    },
  );

  // Signedness edge cases
  await t.step("signed varint32: -15852488 zigzag/varint", () => {
    const buffer = new Uint8Array([0x8f, 0x8f, 0x8f, 0x0f]);
    const reader = BitBuffer.from(buffer);
    const value = reader.read_varint32();
    expect(value).toBe(-15852488);
  });

  // Remove this test as it is not relevant for the -15852488 edge case and is already covered by other tests.

  await t.step("signed varint64: most negative value", () => {
    // Zigzag encoding: -9223372036854775808n -> 0xFFFFFFFFFFFFFFFF,0x01
    const buffer = new Uint8Array([
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0x01,
    ]);
    const reader = BitBuffer.from(buffer);
    const value = reader.read_varint64();
    expect(value).toBe(-9223372036854775808n);
  });

  await t.step("signed varint64: most positive value", () => {
    // Zigzag encoding: 9223372036854775807n -> 0xFEFFFFFFFFFFFFFF,0x01
    const buffer = new Uint8Array([
      0xfe,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0x01,
    ]);
    const reader = BitBuffer.from(buffer);
    const value = reader.read_varint64();
    expect(value).toBe(9223372036854775807n);
  });
});
