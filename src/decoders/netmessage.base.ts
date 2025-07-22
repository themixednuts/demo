import { fromBinary } from "@bufbuild/protobuf";
import {
  type CNETMsg_DebugOverlay,
  CNETMsg_DebugOverlaySchema,
  type CNETMsg_NOP,
  CNETMsg_NOPSchema,
  type CNETMsg_SetConVar,
  CNETMsg_SetConVarSchema,
  type CNETMsg_SignonState,
  CNETMsg_SignonStateSchema,
  type CNETMsg_SpawnGroup_Load,
  type CNETMsg_SpawnGroup_LoadCompleted,
  CNETMsg_SpawnGroup_LoadCompletedSchema,
  CNETMsg_SpawnGroup_LoadSchema,
  type CNETMsg_SpawnGroup_ManifestUpdate,
  CNETMsg_SpawnGroup_ManifestUpdateSchema,
  type CNETMsg_SpawnGroup_SetCreationTick,
  CNETMsg_SpawnGroup_SetCreationTickSchema,
  type CNETMsg_SpawnGroup_Unload,
  CNETMsg_SpawnGroup_UnloadSchema,
  type CNETMsg_SplitScreenUser,
  CNETMsg_SplitScreenUserSchema,
  type CNETMsg_StringCmd,
  CNETMsg_StringCmdSchema,
  type CNETMsg_Tick,
  CNETMsg_TickSchema,
  NET_Messages,
} from "@/gen/networkbasetypes_pb";

// Clean interface mapping for NET message return types
export interface DecoderReturnType {
  [NET_Messages.net_NOP]: CNETMsg_NOP;
  [NET_Messages.net_Disconnect_Legacy]: never;
  [NET_Messages.net_SplitScreenUser]: CNETMsg_SplitScreenUser;
  [NET_Messages.net_Tick]: CNETMsg_Tick;
  [NET_Messages.net_StringCmd]: CNETMsg_StringCmd;
  [NET_Messages.net_SetConVar]: CNETMsg_SetConVar;
  [NET_Messages.net_SignonState]: CNETMsg_SignonState;
  [NET_Messages.net_SpawnGroup_Load]: CNETMsg_SpawnGroup_Load;
  [NET_Messages.net_SpawnGroup_ManifestUpdate]: CNETMsg_SpawnGroup_ManifestUpdate;
  [NET_Messages.net_SpawnGroup_SetCreationTick]: CNETMsg_SpawnGroup_SetCreationTick;
  [NET_Messages.net_SpawnGroup_Unload]: CNETMsg_SpawnGroup_Unload;
  [NET_Messages.net_SpawnGroup_LoadCompleted]: CNETMsg_SpawnGroup_LoadCompleted;
  [NET_Messages.net_DebugOverlay]: CNETMsg_DebugOverlay;
}

export type DecodeMapper = {
  [K in NET_Messages]: (data: Uint8Array) => DecoderReturnType[K];
};

export function isNetMessageBase(type: number): type is NET_Messages {
  return NET_Messages[type] !== undefined;
}

export const DecodeMapper: DecodeMapper = {
  [NET_Messages.net_NOP]: (data: Uint8Array) =>
    fromBinary(CNETMsg_NOPSchema, data),
  [NET_Messages.net_Disconnect_Legacy]: (data: Uint8Array): never => {
    throw new Error("Function not implemented.");
  },
  [NET_Messages.net_SplitScreenUser]: (data: Uint8Array) =>
    fromBinary(CNETMsg_SplitScreenUserSchema, data),
  [NET_Messages.net_Tick]: (data: Uint8Array) =>
    fromBinary(CNETMsg_TickSchema, data),
  [NET_Messages.net_StringCmd]: (data: Uint8Array) =>
    fromBinary(CNETMsg_StringCmdSchema, data),
  [NET_Messages.net_SetConVar]: (data: Uint8Array) =>
    fromBinary(CNETMsg_SetConVarSchema, data),
  [NET_Messages.net_SignonState]: (data: Uint8Array) =>
    fromBinary(CNETMsg_SignonStateSchema, data),
  [NET_Messages.net_SpawnGroup_Load]: (data: Uint8Array) =>
    fromBinary(CNETMsg_SpawnGroup_LoadSchema, data),
  [NET_Messages.net_SpawnGroup_ManifestUpdate]: (data: Uint8Array) =>
    fromBinary(CNETMsg_SpawnGroup_ManifestUpdateSchema, data),
  [NET_Messages.net_SpawnGroup_SetCreationTick]: (data: Uint8Array) =>
    fromBinary(CNETMsg_SpawnGroup_SetCreationTickSchema, data),
  [NET_Messages.net_SpawnGroup_Unload]: (data: Uint8Array) =>
    fromBinary(CNETMsg_SpawnGroup_UnloadSchema, data),
  [NET_Messages.net_SpawnGroup_LoadCompleted]: (data: Uint8Array) =>
    fromBinary(CNETMsg_SpawnGroup_LoadCompletedSchema, data),
  [NET_Messages.net_DebugOverlay]: (data: Uint8Array) =>
    fromBinary(CNETMsg_DebugOverlaySchema, data),
} as const;

export function decode<K extends NET_Messages>(
  cmd: K,
  data: Uint8Array,
): DecoderReturnType[K] {
  return DecodeMapper[cmd](data);
}

// Export registry for the analyzer
import type { MessageTypeRegistry } from "./types";

export const registry: MessageTypeRegistry<
  [typeof NET_Messages],
  NET_Messages,
  DecoderReturnType
> = {
  enums: [NET_Messages],
  isType: isNetMessageBase,
  decode: decode,
  name: "NetMessageBase",
};

export default registry;
