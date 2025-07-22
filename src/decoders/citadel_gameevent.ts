import { fromBinary } from "@bufbuild/protobuf";
import {
  ECitadelGameEvents,
  type CMsgBulletImpact,
  CMsgBulletImpactSchema,
  type CMsgFireBullets,
  CMsgFireBulletsSchema,
  type CMsgPlayerAnimEvent,
  CMsgPlayerAnimEventSchema,
  type CMsgParticleSystemManager,
  CMsgParticleSystemManagerSchema,
  type CMsgScreenTextPretty,
  CMsgScreenTextPrettySchema,
  type CMsgEnableSatVolumesEvent,
  CMsgEnableSatVolumesEventSchema,
  type CMsgPlaceSatVolumeEvent,
  CMsgPlaceSatVolumeEventSchema,
  type CMsgDisableSatVolumesEvent,
  CMsgDisableSatVolumesEventSchema,
  type CMsgRemoveSatVolumeEvent,
  CMsgRemoveSatVolumeEventSchema,
  type CMsgRemoveBullet,
  CMsgRemoveBulletSchema,
} from "@/gen/citadel_gameevents_pb";

export interface CitadelGameEventDecoderReturnType {
  [ECitadelGameEvents.GE_FireBullets]: CMsgFireBullets;
  [ECitadelGameEvents.GE_PlayerAnimEvent]: CMsgPlayerAnimEvent;
  [ECitadelGameEvents.GE_ParticleSystemManager]: CMsgParticleSystemManager;
  [ECitadelGameEvents.GE_ScreenTextPretty]: CMsgScreenTextPretty;
  [ECitadelGameEvents.GE_BulletImpact]: CMsgBulletImpact;
  [ECitadelGameEvents.GE_EnableSatVolumesEvent]: CMsgEnableSatVolumesEvent;
  [ECitadelGameEvents.GE_PlaceSatVolumeEvent]: CMsgPlaceSatVolumeEvent;
  [ECitadelGameEvents.GE_DisableSatVolumesEvent]: CMsgDisableSatVolumesEvent;
  [ECitadelGameEvents.GE_RemoveSatVolumeEvent]: CMsgRemoveSatVolumeEvent;
  [ECitadelGameEvents.GE_RemoveBullet]: CMsgRemoveBullet;
}

export type CitadelGameEventDecodeMapper = {
  [K in ECitadelGameEvents]: (
    data: Uint8Array,
  ) => CitadelGameEventDecoderReturnType[K];
};

export function isCitadelGameEvent(type: number): type is ECitadelGameEvents {
  return ECitadelGameEvents[type] !== undefined;
}

export const CitadelGameEventDecoder: CitadelGameEventDecodeMapper = {
  [ECitadelGameEvents.GE_FireBullets]: (data: Uint8Array) =>
    fromBinary(CMsgFireBulletsSchema, data),
  [ECitadelGameEvents.GE_PlayerAnimEvent]: (data: Uint8Array) =>
    fromBinary(CMsgPlayerAnimEventSchema, data),
  [ECitadelGameEvents.GE_ParticleSystemManager]: (data: Uint8Array) =>
    fromBinary(CMsgParticleSystemManagerSchema, data),
  [ECitadelGameEvents.GE_ScreenTextPretty]: (data: Uint8Array) =>
    fromBinary(CMsgScreenTextPrettySchema, data),
  [ECitadelGameEvents.GE_BulletImpact]: (data: Uint8Array) =>
    fromBinary(CMsgBulletImpactSchema, data),
  [ECitadelGameEvents.GE_EnableSatVolumesEvent]: (data: Uint8Array) =>
    fromBinary(CMsgEnableSatVolumesEventSchema, data),
  [ECitadelGameEvents.GE_PlaceSatVolumeEvent]: (data: Uint8Array) =>
    fromBinary(CMsgPlaceSatVolumeEventSchema, data),
  [ECitadelGameEvents.GE_DisableSatVolumesEvent]: (data: Uint8Array) =>
    fromBinary(CMsgDisableSatVolumesEventSchema, data),
  [ECitadelGameEvents.GE_RemoveSatVolumeEvent]: (data: Uint8Array) =>
    fromBinary(CMsgRemoveSatVolumeEventSchema, data),
  [ECitadelGameEvents.GE_RemoveBullet]: (data: Uint8Array) =>
    fromBinary(CMsgRemoveBulletSchema, data),
};

export function decode<K extends ECitadelGameEvents>(
  cmd: K,
  data: Uint8Array,
): CitadelGameEventDecoderReturnType[K] {
  return CitadelGameEventDecoder[cmd](data);
}

// Export registry for the analyzer
import type { MessageTypeRegistry } from "./types";

export const registry: MessageTypeRegistry<
  [typeof ECitadelGameEvents],
  ECitadelGameEvents,
  CitadelGameEventDecoderReturnType
> = {
  enums: [ECitadelGameEvents],
  isType: isCitadelGameEvent,
  decode: decode,
  name: "CitadelGameEvent",
};

export default registry;
