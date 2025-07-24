// Helper type to get union of all values from tuple of enums
type ExtractEnumValues<TEnums extends readonly Record<string | number, any>[]> =
	{
		[K in keyof TEnums]: TEnums[K] extends Record<string | number, infer U>
			? U extends string | number ? U
			: never
			: never;
	}[number];
/**
 * Generic Message Type Registry Interface
 *
 * This interface ensures that message decoders are self-contained and provide:
 * 1. The enums they handle (for name resolution)
 * 2. A type guard function to check if a message type belongs to this decoder
 * 3. A decode function to handle the actual message decoding
 *
 * Each decoder should export a registry object implementing this interface.
 *
 * @template TMessageType - The message type enum (e.g., NET_Messages, CitadelUserMessageIds)
 * @template TReturnTypeMap - The return type mapping for decoded messages
 * @template TEnums - The tuple of enum objects this decoder handles
 *
 * @example Adding a new decoder
 * ```typescript
 * // In your-new-decoder.ts:
 * import type { MessageTypeRegistry } from "./types";
 *
 * export function isMyMessageType(type: number): type is MyMessageEnum {
 *   return MyMessageEnum[type] !== undefined;
 * }
 *
 * export function decode<K extends MyMessageEnum>(
 *   cmd: K,
 *   data: Uint8Array
 * ): MyMessageReturnType[K] {
 *   return MyMessageDecoder[cmd](data);
 * }
 *
 * // Export registry for the analyzer
 * const registry: MessageTypeRegistry<
 *   [typeof MyMessageEnum],
 *   MyMessageEnum,
 *   MyMessageReturnType
 * > = {
 *   enums: [MyMessageEnum],
 *   isType: isMyMessageType,
 *   decode: decode,
 *   name: "MyMessage",
 * };
 *
 * export default registry;
 * ```
 *
 * Then import and add the registry to the analyzer in `src/analyzer/index.ts`:
 * ```typescript
 * import myMessageRegistry from "../decoders/your-new-decoder";
 *
 * private messageTypeRegistries = [
 *   // ... existing registries
 *   myMessageRegistry,
 * ];
 * ```
 */
export interface MessageTypeRegistry<
	TEnums extends readonly Record<string | number, any>[],
	TMessageType extends ExtractEnumValues<TEnums> = ExtractEnumValues<TEnums>,
	TReturnTypeMap extends Record<TMessageType, any> = Record<TMessageType, any>,
> {
	/** The enum objects this decoder handles (for message name resolution) */
	enums: TEnums;
	/** Type guard function to check if a message type belongs to this decoder */
	isType: (type: number) => type is TMessageType;
	/** Decoder function that handles message decoding for the supported types */
	decode: (
		type: TMessageType,
		data: Uint8Array,
	) => TReturnTypeMap[TMessageType];
	name?: string;
}
