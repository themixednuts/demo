import { fromBinary } from '@bufbuild/protobuf';
import {
	Bidirectional_Messages,
	type CBidirMsg_PredictionEvent,
	CBidirMsg_PredictionEventSchema,
	type CBidirMsg_RebroadcastGameEvent,
	CBidirMsg_RebroadcastGameEventSchema,
	type CBidirMsg_RebroadcastSource,
	CBidirMsg_RebroadcastSourceSchema,
	type CCLCMsg_BaselineAck,
	CCLCMsg_BaselineAckSchema,
	type CCLCMsg_ClientInfo,
	CCLCMsg_ClientInfoSchema,
	type CCLCMsg_CmdKeyValues,
	CCLCMsg_CmdKeyValuesSchema,
	type CCLCMsg_Diagnostic,
	CCLCMsg_DiagnosticSchema,
	type CCLCMsg_FileCRCCheck,
	CCLCMsg_FileCRCCheckSchema,
	type CCLCMsg_HltvReplay,
	CCLCMsg_HltvReplaySchema,
	type CCLCMsg_LoadingProgress,
	CCLCMsg_LoadingProgressSchema,
	type CCLCMsg_Move,
	CCLCMsg_MoveSchema,
	type CCLCMsg_RconServerDetails,
	CCLCMsg_RconServerDetailsSchema,
	type CCLCMsg_RequestPause,
	CCLCMsg_RequestPauseSchema,
	type CCLCMsg_RespondCvarValue,
	CCLCMsg_RespondCvarValueSchema,
	type CCLCMsg_ServerStatus,
	CCLCMsg_ServerStatusSchema,
	type CCLCMsg_SplitPlayerConnect,
	CCLCMsg_SplitPlayerConnectSchema,
	type CCLCMsg_SplitPlayerDisconnect,
	CCLCMsg_SplitPlayerDisconnectSchema,
	type CCLCMsg_VoiceData,
	CCLCMsg_VoiceDataSchema,
	CLC_Messages,
	type CSVCMsg_Broadcast_Command,
	CSVCMsg_Broadcast_CommandSchema,
	type CSVCMsg_BSPDecal,
	CSVCMsg_BSPDecalSchema,
	type CSVCMsg_ClassInfo,
	CSVCMsg_ClassInfoSchema,
	type CSVCMsg_ClearAllStringTables,
	CSVCMsg_ClearAllStringTablesSchema,
	type CSVCMsg_CmdKeyValues,
	CSVCMsg_CmdKeyValuesSchema,
	type CSVCMsg_CreateStringTable,
	CSVCMsg_CreateStringTableSchema,
	type CSVCMsg_FlattenedSerializer,
	CSVCMsg_FlattenedSerializerSchema,
	type CSVCMsg_FullFrameSplit,
	CSVCMsg_FullFrameSplitSchema,
	type CSVCMsg_GameEventList,
	CSVCMsg_GameEventListSchema,
	type CSVCMsg_GetCvarValue,
	CSVCMsg_GetCvarValueSchema,
	type CSVCMsg_HltvFixupOperatorStatus,
	CSVCMsg_HltvFixupOperatorStatusSchema,
	type CSVCMsg_HltvReplay,
	CSVCMsg_HltvReplaySchema,
	type CSVCMsg_HLTVStatus,
	CSVCMsg_HLTVStatusSchema,
	type CSVCMsg_Menu,
	CSVCMsg_MenuSchema,
	type CSVCMsg_PacketEntities,
	CSVCMsg_PacketEntitiesSchema,
	type CSVCMsg_PacketReliable,
	CSVCMsg_PacketReliableSchema,
	type CSVCMsg_PeerList,
	CSVCMsg_PeerListSchema,
	type CSVCMsg_Prefetch,
	CSVCMsg_PrefetchSchema,
	type CSVCMsg_Print,
	CSVCMsg_PrintSchema,
	type CSVCMsg_RconServerDetails,
	CSVCMsg_RconServerDetailsSchema,
	type CSVCMsg_SendTable,
	CSVCMsg_SendTableSchema,
	type CSVCMsg_ServerInfo,
	CSVCMsg_ServerInfoSchema,
	type CSVCMsg_ServerSteamID,
	CSVCMsg_ServerSteamIDSchema,
	type CSVCMsg_SetPause,
	CSVCMsg_SetPauseSchema,
	type CSVCMsg_SetView,
	CSVCMsg_SetViewSchema,
	type CSVCMsg_Sounds,
	CSVCMsg_SoundsSchema,
	type CSVCMsg_SplitScreen,
	CSVCMsg_SplitScreenSchema,
	type CSVCMsg_StopSound,
	CSVCMsg_StopSoundSchema,
	type CSVCMsg_TempEntities,
	CSVCMsg_TempEntitiesSchema,
	type CSVCMsg_UpdateStringTable,
	CSVCMsg_UpdateStringTableSchema,
	type CSVCMsg_UserCommands,
	CSVCMsg_UserCommandsSchema,
	type CSVCMsg_UserMessage,
	CSVCMsg_UserMessageSchema,
	type CSVCMsg_VoiceData,
	CSVCMsg_VoiceDataSchema,
	type CSVCMsg_VoiceInit,
	CSVCMsg_VoiceInitSchema,
	SVC_Messages,
} from '@/gen/netmessages_pb.ts';
import {
	type CSVCMsg_GameEvent,
	CSVCMsg_GameEventSchema,
} from '@/gen/networkbasetypes_pb.ts';

// Union type for all message enums
export type AllNetMessages =
	| CLC_Messages
	| SVC_Messages
	| Bidirectional_Messages;

// Clean interface mapping for net message return types
export interface DecoderReturnType {
	[CLC_Messages.clc_ClientInfo]: CCLCMsg_ClientInfo;
	[CLC_Messages.clc_Move]: CCLCMsg_Move;
	[CLC_Messages.clc_VoiceData]: CCLCMsg_VoiceData;
	[CLC_Messages.clc_BaselineAck]: CCLCMsg_BaselineAck;
	[CLC_Messages.clc_RespondCvarValue]: CCLCMsg_RespondCvarValue;
	[CLC_Messages.clc_FileCRCCheck]: CCLCMsg_FileCRCCheck;
	[CLC_Messages.clc_LoadingProgress]: CCLCMsg_LoadingProgress;
	[CLC_Messages.clc_SplitPlayerConnect]: CCLCMsg_SplitPlayerConnect;
	[CLC_Messages.clc_SplitPlayerDisconnect]: CCLCMsg_SplitPlayerDisconnect;
	[CLC_Messages.clc_ServerStatus]: CCLCMsg_ServerStatus;
	[CLC_Messages.clc_RequestPause]: CCLCMsg_RequestPause;
	[CLC_Messages.clc_CmdKeyValues]: CCLCMsg_CmdKeyValues;
	[CLC_Messages.clc_RconServerDetails]: CCLCMsg_RconServerDetails;
	[CLC_Messages.clc_HltvReplay]: CCLCMsg_HltvReplay;
	[CLC_Messages.clc_Diagnostic]: CCLCMsg_Diagnostic;
	[SVC_Messages.svc_ServerInfo]: CSVCMsg_ServerInfo;
	[SVC_Messages.svc_FlattenedSerializer]: CSVCMsg_FlattenedSerializer;
	[SVC_Messages.svc_ClassInfo]: CSVCMsg_ClassInfo;
	[SVC_Messages.svc_SetPause]: CSVCMsg_SetPause;
	[SVC_Messages.svc_CreateStringTable]: CSVCMsg_CreateStringTable;
	[SVC_Messages.svc_UpdateStringTable]: CSVCMsg_UpdateStringTable;
	[SVC_Messages.svc_VoiceInit]: CSVCMsg_VoiceInit;
	[SVC_Messages.svc_VoiceData]: CSVCMsg_VoiceData;
	[SVC_Messages.svc_Print]: CSVCMsg_Print;
	[SVC_Messages.svc_Sounds]: CSVCMsg_Sounds;
	[SVC_Messages.svc_SetView]: CSVCMsg_SetView;
	[SVC_Messages.svc_ClearAllStringTables]: CSVCMsg_ClearAllStringTables;
	[SVC_Messages.svc_CmdKeyValues]: CSVCMsg_CmdKeyValues;
	[SVC_Messages.svc_BSPDecal]: CSVCMsg_BSPDecal;
	[SVC_Messages.svc_SplitScreen]: CSVCMsg_SplitScreen;
	[SVC_Messages.svc_PacketEntities]: CSVCMsg_PacketEntities;
	[SVC_Messages.svc_Prefetch]: CSVCMsg_Prefetch;
	[SVC_Messages.svc_Menu]: CSVCMsg_Menu;
	[SVC_Messages.svc_GetCvarValue]: CSVCMsg_GetCvarValue;
	[SVC_Messages.svc_StopSound]: CSVCMsg_StopSound;
	[SVC_Messages.svc_PeerList]: CSVCMsg_PeerList;
	[SVC_Messages.svc_PacketReliable]: CSVCMsg_PacketReliable;
	[SVC_Messages.svc_HLTVStatus]: CSVCMsg_HLTVStatus;
	[SVC_Messages.svc_ServerSteamID]: CSVCMsg_ServerSteamID;
	[SVC_Messages.svc_FullFrameSplit]: CSVCMsg_FullFrameSplit;
	[SVC_Messages.svc_RconServerDetails]: CSVCMsg_RconServerDetails;
	[SVC_Messages.svc_UserMessage]: CSVCMsg_UserMessage;
	[SVC_Messages.svc_Broadcast_Command]: CSVCMsg_Broadcast_Command;
	[SVC_Messages.svc_HltvFixupOperatorStatus]: CSVCMsg_HltvFixupOperatorStatus;
	[SVC_Messages.svc_UserCmds]: CSVCMsg_UserCommands;
	[Bidirectional_Messages.bi_RebroadcastGameEvent]:
		CBidirMsg_RebroadcastGameEvent;
	[Bidirectional_Messages.bi_RebroadcastSource]: CBidirMsg_RebroadcastSource;
	[Bidirectional_Messages.bi_GameEvent]: CSVCMsg_GameEvent;
	[Bidirectional_Messages.bi_PredictionEvent]: CBidirMsg_PredictionEvent;
}

export type DecodeMapper = {
	[K in AllNetMessages]: (data: Uint8Array) => DecoderReturnType[K];
};

export function isNetMessage(type: number): type is AllNetMessages {
	return (
		CLC_Messages[type] !== undefined ||
		SVC_Messages[type] !== undefined ||
		Bidirectional_Messages[type] !== undefined
	);
}

export const NetMessageDecoder: DecodeMapper = {
	// CLC Messages (Client to Server)
	[CLC_Messages.clc_ClientInfo]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_ClientInfoSchema, data),
	[CLC_Messages.clc_Move]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_MoveSchema, data),
	[CLC_Messages.clc_VoiceData]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_VoiceDataSchema, data),
	[CLC_Messages.clc_BaselineAck]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_BaselineAckSchema, data),
	[CLC_Messages.clc_RespondCvarValue]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_RespondCvarValueSchema, data),
	[CLC_Messages.clc_FileCRCCheck]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_FileCRCCheckSchema, data),
	[CLC_Messages.clc_LoadingProgress]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_LoadingProgressSchema, data),
	[CLC_Messages.clc_SplitPlayerConnect]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_SplitPlayerConnectSchema, data),
	[CLC_Messages.clc_SplitPlayerDisconnect]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_SplitPlayerDisconnectSchema, data),
	[CLC_Messages.clc_ServerStatus]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_ServerStatusSchema, data),
	[CLC_Messages.clc_RequestPause]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_RequestPauseSchema, data),
	[CLC_Messages.clc_CmdKeyValues]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_CmdKeyValuesSchema, data),
	[CLC_Messages.clc_RconServerDetails]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_RconServerDetailsSchema, data),
	[CLC_Messages.clc_HltvReplay]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_HltvReplaySchema, data),
	[CLC_Messages.clc_Diagnostic]: (data: Uint8Array) =>
		fromBinary(CCLCMsg_DiagnosticSchema, data),

	// SVC Messages (Server to Client)
	[SVC_Messages.svc_ServerInfo]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_ServerInfoSchema, data),
	[SVC_Messages.svc_FlattenedSerializer]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_FlattenedSerializerSchema, data),
	[SVC_Messages.svc_ClassInfo]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_ClassInfoSchema, data),
	[SVC_Messages.svc_SetPause]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_SetPauseSchema, data),
	[SVC_Messages.svc_CreateStringTable]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_CreateStringTableSchema, data),
	[SVC_Messages.svc_UpdateStringTable]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_UpdateStringTableSchema, data),
	[SVC_Messages.svc_VoiceInit]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_VoiceInitSchema, data),
	[SVC_Messages.svc_VoiceData]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_VoiceDataSchema, data),
	[SVC_Messages.svc_Print]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_PrintSchema, data),
	[SVC_Messages.svc_Sounds]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_SoundsSchema, data),
	[SVC_Messages.svc_SetView]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_SetViewSchema, data),
	[SVC_Messages.svc_ClearAllStringTables]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_ClearAllStringTablesSchema, data),
	[SVC_Messages.svc_CmdKeyValues]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_CmdKeyValuesSchema, data),
	[SVC_Messages.svc_BSPDecal]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_BSPDecalSchema, data),
	[SVC_Messages.svc_SplitScreen]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_SplitScreenSchema, data),
	[SVC_Messages.svc_PacketEntities]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_PacketEntitiesSchema, data),
	[SVC_Messages.svc_Prefetch]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_PrefetchSchema, data),
	[SVC_Messages.svc_Menu]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_MenuSchema, data),
	[SVC_Messages.svc_GetCvarValue]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_GetCvarValueSchema, data),
	[SVC_Messages.svc_StopSound]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_StopSoundSchema, data),
	[SVC_Messages.svc_PeerList]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_PeerListSchema, data),
	[SVC_Messages.svc_PacketReliable]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_PacketReliableSchema, data),
	[SVC_Messages.svc_HLTVStatus]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_HLTVStatusSchema, data),
	[SVC_Messages.svc_ServerSteamID]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_ServerSteamIDSchema, data),
	[SVC_Messages.svc_FullFrameSplit]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_FullFrameSplitSchema, data),
	[SVC_Messages.svc_RconServerDetails]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_RconServerDetailsSchema, data),
	[SVC_Messages.svc_UserMessage]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_UserMessageSchema, data),
	[SVC_Messages.svc_Broadcast_Command]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_Broadcast_CommandSchema, data),
	[SVC_Messages.svc_HltvFixupOperatorStatus]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_HltvFixupOperatorStatusSchema, data),
	[SVC_Messages.svc_UserCmds]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_UserCommandsSchema, data),

	// Bidirectional Messages
	[Bidirectional_Messages.bi_RebroadcastGameEvent]: (data: Uint8Array) =>
		fromBinary(CBidirMsg_RebroadcastGameEventSchema, data),
	[Bidirectional_Messages.bi_RebroadcastSource]: (data: Uint8Array) =>
		fromBinary(CBidirMsg_RebroadcastSourceSchema, data),
	[Bidirectional_Messages.bi_GameEvent]: (data: Uint8Array) =>
		fromBinary(CSVCMsg_GameEventSchema, data),
	[Bidirectional_Messages.bi_PredictionEvent]: (data: Uint8Array) =>
		fromBinary(CBidirMsg_PredictionEventSchema, data),
};

export function decode<K extends AllNetMessages>(
	cmd: K,
	data: Uint8Array,
): DecoderReturnType[K] {
	return NetMessageDecoder[cmd](data);
}

// Export registry for the analyzer
import type { MessageTypeRegistry } from './types.ts';

export const registry: MessageTypeRegistry<
	[typeof CLC_Messages, typeof SVC_Messages, typeof Bidirectional_Messages],
	AllNetMessages,
	DecoderReturnType
> = {
	enums: [CLC_Messages, SVC_Messages, Bidirectional_Messages],
	isType: isNetMessage,
	decode: decode,
	name: 'NetMessage',
} as const;

export default registry;
