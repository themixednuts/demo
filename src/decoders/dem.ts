import { fromBinary } from '@bufbuild/protobuf';
import {
	type CDemoAnimationData,
	CDemoAnimationDataSchema,
	type CDemoAnimationHeader,
	CDemoAnimationHeaderSchema,
	type CDemoClassInfo,
	CDemoClassInfoSchema,
	type CDemoConsoleCmd,
	CDemoConsoleCmdSchema,
	type CDemoCustomData,
	type CDemoCustomDataCallbacks,
	CDemoCustomDataCallbacksSchema,
	CDemoCustomDataSchema,
	type CDemoFileHeader,
	CDemoFileHeaderSchema,
	type CDemoFileInfo,
	CDemoFileInfoSchema,
	type CDemoFullPacket,
	CDemoFullPacketSchema,
	type CDemoPacket,
	CDemoPacketSchema,
	type CDemoRecovery,
	CDemoRecoverySchema,
	type CDemoSaveGame,
	CDemoSaveGameSchema,
	type CDemoSendTables,
	CDemoSendTablesSchema,
	type CDemoSpawnGroups,
	CDemoSpawnGroupsSchema,
	type CDemoStop,
	CDemoStopSchema,
	type CDemoStringTables,
	CDemoStringTablesSchema,
	type CDemoSyncTick,
	CDemoSyncTickSchema,
	type CDemoUserCmd,
	CDemoUserCmdSchema,
	EDemoCommands,
} from '../gen/demo_pb.ts';

export interface DecoderReturnType {
	[EDemoCommands.DEM_Error]: never;
	[EDemoCommands.DEM_Stop]: CDemoStop;
	[EDemoCommands.DEM_FileHeader]: CDemoFileHeader;
	[EDemoCommands.DEM_FileInfo]: CDemoFileInfo;
	[EDemoCommands.DEM_SyncTick]: CDemoSyncTick;
	[EDemoCommands.DEM_SendTables]: CDemoSendTables;
	[EDemoCommands.DEM_ClassInfo]: CDemoClassInfo;
	[EDemoCommands.DEM_StringTables]: CDemoStringTables;
	[EDemoCommands.DEM_Packet]: Generator<DemoPacket>;
	[EDemoCommands.DEM_SignonPacket]: Generator<DemoPacket>;
	[EDemoCommands.DEM_ConsoleCmd]: CDemoConsoleCmd;
	[EDemoCommands.DEM_CustomData]: CDemoCustomData;
	[EDemoCommands.DEM_CustomDataCallbacks]: CDemoCustomDataCallbacks;
	[EDemoCommands.DEM_UserCmd]: CDemoUserCmd;
	[EDemoCommands.DEM_FullPacket]: CDemoFullPacket;
	[EDemoCommands.DEM_SaveGame]: CDemoSaveGame;
	[EDemoCommands.DEM_SpawnGroups]: Generator<SequenceDemoPacket>;
	[EDemoCommands.DEM_AnimationData]: CDemoAnimationData;
	[EDemoCommands.DEM_AnimationHeader]: CDemoAnimationHeader;
	[EDemoCommands.DEM_Recovery]: CDemoRecovery;
	[EDemoCommands.DEM_Max]: never;
	[EDemoCommands.DEM_IsCompressed]: never;
}

export type DecodeMapper = {
	[K in EDemoCommands]: (data: Uint8Array) => DecoderReturnType[K];
};

export function isDemoCommand(type: number): type is EDemoCommands {
	return EDemoCommands[type] !== undefined;
}

export const DEMDecoder: DecodeMapper = {
	[EDemoCommands.DEM_Error]: (data: Uint8Array): never => {
		throw new Error('Function not implemented.');
	},
	[EDemoCommands.DEM_Stop]: (data: Uint8Array) =>
		fromBinary(CDemoStopSchema, data),
	[EDemoCommands.DEM_FileHeader]: (data: Uint8Array) =>
		fromBinary(CDemoFileHeaderSchema, data),
	[EDemoCommands.DEM_FileInfo]: (data: Uint8Array) =>
		fromBinary(CDemoFileInfoSchema, data),
	[EDemoCommands.DEM_SyncTick]: (data: Uint8Array) =>
		fromBinary(CDemoSyncTickSchema, data),
	[EDemoCommands.DEM_SendTables]: (data: Uint8Array) =>
		fromBinary(CDemoSendTablesSchema, data),
	[EDemoCommands.DEM_ClassInfo]: (data: Uint8Array) =>
		fromBinary(CDemoClassInfoSchema, data),
	[EDemoCommands.DEM_StringTables]: (data: Uint8Array) =>
		fromBinary(CDemoStringTablesSchema, data),
	[EDemoCommands.DEM_Packet]: (data: Uint8Array) => DemoPacket.from(data),
	[EDemoCommands.DEM_SignonPacket]: (data: Uint8Array) => DemoPacket.from(data),
	[EDemoCommands.DEM_ConsoleCmd]: (data: Uint8Array) =>
		fromBinary(CDemoConsoleCmdSchema, data),
	[EDemoCommands.DEM_CustomData]: (data: Uint8Array) =>
		fromBinary(CDemoCustomDataSchema, data),
	[EDemoCommands.DEM_CustomDataCallbacks]: (data: Uint8Array) =>
		fromBinary(CDemoCustomDataCallbacksSchema, data),
	[EDemoCommands.DEM_UserCmd]: (data: Uint8Array) =>
		fromBinary(CDemoUserCmdSchema, data),
	[EDemoCommands.DEM_FullPacket]: (data: Uint8Array) =>
		fromBinary(CDemoFullPacketSchema, data),
	[EDemoCommands.DEM_SaveGame]: (data: Uint8Array) =>
		fromBinary(CDemoSaveGameSchema, data),
	[EDemoCommands.DEM_SpawnGroups]: (data: Uint8Array) =>
		SequenceDemoPacket.from(data),
	[EDemoCommands.DEM_AnimationData]: (data: Uint8Array) =>
		fromBinary(CDemoAnimationDataSchema, data),
	[EDemoCommands.DEM_AnimationHeader]: (data: Uint8Array) =>
		fromBinary(CDemoAnimationHeaderSchema, data),
	[EDemoCommands.DEM_Recovery]: (data: Uint8Array) =>
		fromBinary(CDemoRecoverySchema, data),
	[EDemoCommands.DEM_IsCompressed]: (data: Uint8Array): never => {
		throw new Error('Function not implemented.');
	},
	[EDemoCommands.DEM_Max]: (data: Uint8Array): never => {
		throw new Error('Function not implemented.');
	},
} as const;

export function decode<K extends EDemoCommands>(
	cmd: K,
	data: Uint8Array,
): DecoderReturnType[K] {
	return DEMDecoder[cmd](data);
}

// Export registry for the analyzer
import type { MessageTypeRegistry } from './types.ts';
import { DemoPacket, SequenceDemoPacket } from '../packet.ts';

export const registry: MessageTypeRegistry<
	[typeof EDemoCommands],
	EDemoCommands,
	DecoderReturnType
> = {
	enums: [EDemoCommands],
	isType: isDemoCommand,
	decode: decode,
	name: 'DemoCommand',
};

export default registry;
