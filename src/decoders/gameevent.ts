import { fromBinary } from '@bufbuild/protobuf';
import {
	type CMsgClearDecalsForSkeletonInstanceEvent,
	CMsgClearDecalsForSkeletonInstanceEventSchema,
	type CMsgClearEntityDecalsEvent,
	CMsgClearEntityDecalsEventSchema,
	type CMsgClearWorldDecalsEvent,
	CMsgClearWorldDecalsEventSchema,
	type CMsgPlaceDecalEvent,
	CMsgPlaceDecalEventSchema,
	type CMsgSosSetLibraryStackFields,
	CMsgSosSetLibraryStackFieldsSchema,
	type CMsgSosSetSoundEventParams,
	CMsgSosSetSoundEventParamsSchema,
	type CMsgSosStartSoundEvent,
	CMsgSosStartSoundEventSchema,
	type CMsgSosStopSoundEvent,
	type CMsgSosStopSoundEventHash,
	CMsgSosStopSoundEventHashSchema,
	CMsgSosStopSoundEventSchema,
	type CMsgSource1LegacyGameEvent,
	type CMsgSource1LegacyGameEventList,
	CMsgSource1LegacyGameEventListSchema,
	CMsgSource1LegacyGameEventSchema,
	type CMsgSource1LegacyListenEvents,
	CMsgSource1LegacyListenEventsSchema,
	type CMsgVDebugGameSessionIDEvent,
	CMsgVDebugGameSessionIDEventSchema,
	EBaseGameEvents,
} from '@/gen/gameevents_pb.ts';

export interface DecoderReturnType {
	[EBaseGameEvents.GE_VDebugGameSessionIDEvent]: CMsgVDebugGameSessionIDEvent;
	[EBaseGameEvents.GE_PlaceDecalEvent]: CMsgPlaceDecalEvent;
	[EBaseGameEvents.GE_ClearWorldDecalsEvent]: CMsgClearWorldDecalsEvent;
	[EBaseGameEvents.GE_ClearEntityDecalsEvent]: CMsgClearEntityDecalsEvent;
	[EBaseGameEvents.GE_ClearDecalsForSkeletonInstanceEvent]:
		CMsgClearDecalsForSkeletonInstanceEvent;
	[EBaseGameEvents.GE_Source1LegacyGameEventList]:
		CMsgSource1LegacyGameEventList;
	[EBaseGameEvents.GE_Source1LegacyListenEvents]: CMsgSource1LegacyListenEvents;
	[EBaseGameEvents.GE_Source1LegacyGameEvent]: CMsgSource1LegacyGameEvent;
	[EBaseGameEvents.GE_SosStartSoundEvent]: CMsgSosStartSoundEvent;
	[EBaseGameEvents.GE_SosStopSoundEvent]: CMsgSosStopSoundEvent;
	[EBaseGameEvents.GE_SosSetSoundEventParams]: CMsgSosSetSoundEventParams;
	[EBaseGameEvents.GE_SosSetLibraryStackFields]: CMsgSosSetLibraryStackFields;
	[EBaseGameEvents.GE_SosStopSoundEventHash]: CMsgSosStopSoundEventHash;
}

export type DecodeMapper = {
	[K in EBaseGameEvents]: (data: Uint8Array) => DecoderReturnType[K];
};

export function isGameEvent(type: number): type is EBaseGameEvents {
	return EBaseGameEvents[type] !== undefined;
}

export const GameEventDecoder: DecodeMapper = {
	[EBaseGameEvents.GE_VDebugGameSessionIDEvent]: (data: Uint8Array) =>
		fromBinary(CMsgVDebugGameSessionIDEventSchema, data),
	[EBaseGameEvents.GE_PlaceDecalEvent]: (data: Uint8Array) =>
		fromBinary(CMsgPlaceDecalEventSchema, data),
	[EBaseGameEvents.GE_ClearWorldDecalsEvent]: (data: Uint8Array) =>
		fromBinary(CMsgClearWorldDecalsEventSchema, data),
	[EBaseGameEvents.GE_ClearEntityDecalsEvent]: (data: Uint8Array) =>
		fromBinary(CMsgClearEntityDecalsEventSchema, data),
	[EBaseGameEvents.GE_ClearDecalsForSkeletonInstanceEvent]: (
		data: Uint8Array,
	) => fromBinary(CMsgClearDecalsForSkeletonInstanceEventSchema, data),
	[EBaseGameEvents.GE_Source1LegacyGameEventList]: (data: Uint8Array) =>
		fromBinary(CMsgSource1LegacyGameEventListSchema, data),
	[EBaseGameEvents.GE_Source1LegacyListenEvents]: (data: Uint8Array) =>
		fromBinary(CMsgSource1LegacyListenEventsSchema, data),
	[EBaseGameEvents.GE_Source1LegacyGameEvent]: (data: Uint8Array) =>
		fromBinary(CMsgSource1LegacyGameEventSchema, data),
	[EBaseGameEvents.GE_SosStartSoundEvent]: (data: Uint8Array) =>
		fromBinary(CMsgSosStartSoundEventSchema, data),
	[EBaseGameEvents.GE_SosStopSoundEvent]: (data: Uint8Array) =>
		fromBinary(CMsgSosStopSoundEventSchema, data),
	[EBaseGameEvents.GE_SosSetSoundEventParams]: (data: Uint8Array) =>
		fromBinary(CMsgSosSetSoundEventParamsSchema, data),
	[EBaseGameEvents.GE_SosStopSoundEventHash]: (data: Uint8Array) =>
		fromBinary(CMsgSosStopSoundEventHashSchema, data),
	[EBaseGameEvents.GE_SosSetLibraryStackFields]: (data: Uint8Array) =>
		fromBinary(CMsgSosSetLibraryStackFieldsSchema, data),
} as const;

export function decode<K extends EBaseGameEvents>(
	cmd: K,
	data: Uint8Array,
): DecoderReturnType[K] {
	return GameEventDecoder[cmd](data);
}

// Export registry for the analyzer
import type { MessageTypeRegistry } from './types.ts';

export const registry: MessageTypeRegistry<
	[typeof EBaseGameEvents],
	EBaseGameEvents,
	DecoderReturnType
> = {
	enums: [EBaseGameEvents],
	isType: isGameEvent,
	decode: decode,
	name: 'GameEvent',
} as const;

export default registry;
