import { fromBinary } from "@bufbuild/protobuf";
import {
	ETEProtobufIds,
	type CMsgEffectData,
	CMsgEffectDataSchema,
	type CMsgTEArmorRicochet,
	CMsgTEArmorRicochetSchema,
	type CMsgTEBeamEntPoint,
	CMsgTEBeamEntPointSchema,
	type CMsgTEBeamEnts,
	CMsgTEBeamEntsSchema,
	type CMsgTEBeamPoints,
	CMsgTEBeamPointsSchema,
	type CMsgTEBeamRing,
	CMsgTEBeamRingSchema,
	type CMsgTEBSPDecal,
	CMsgTEBSPDecalSchema,
	type CMsgTEBubbles,
	CMsgTEBubblesSchema,
	type CMsgTEBubbleTrail,
	CMsgTEBubbleTrailSchema,
	type CMsgTEDecal,
	CMsgTEDecalSchema,
	type CMsgTEWorldDecal,
	CMsgTEWorldDecalSchema,
	type CMsgTEEnergySplash,
	CMsgTEEnergySplashSchema,
	type CMsgTEFizz,
	CMsgTEFizzSchema,
	type CMsgTEShatterSurface,
	CMsgTEShatterSurfaceSchema,
	type CMsgTEGlowSprite,
	CMsgTEGlowSpriteSchema,
	type CMsgTEImpact,
	CMsgTEImpactSchema,
	type CMsgTEMuzzleFlash,
	CMsgTEMuzzleFlashSchema,
	type CMsgTEBloodStream,
	CMsgTEBloodStreamSchema,
	type CMsgTEExplosion,
	CMsgTEExplosionSchema,
	type CMsgTEDust,
	CMsgTEDustSchema,
	type CMsgTELargeFunnel,
	CMsgTELargeFunnelSchema,
	type CMsgTESparks,
	CMsgTESparksSchema,
	type CMsgTEPhysicsProp,
	CMsgTEPhysicsPropSchema,
	type CMsgTEPlayerDecal,
	CMsgTEPlayerDecalSchema,
	type CMsgTEProjectedDecal,
	CMsgTEProjectedDecalSchema,
	type CMsgTESmoke,
	CMsgTESmokeSchema,
	type CMsgTEEffectDispatch,
	CMsgTEEffectDispatchSchema,
} from "@/gen/te_pb.ts";

// Explicit mapping for each enum value - TypeScript will error if any are missing
export interface TempEntityDecoderReturnType {
	[ETEProtobufIds.TE_EffectDispatchId]: CMsgTEEffectDispatch;
	[ETEProtobufIds.TE_ArmorRicochetId]: CMsgTEArmorRicochet;
	[ETEProtobufIds.TE_BeamEntPointId]: CMsgTEBeamEntPoint;
	[ETEProtobufIds.TE_BeamEntsId]: CMsgTEBeamEnts;
	[ETEProtobufIds.TE_BeamPointsId]: CMsgTEBeamPoints;
	[ETEProtobufIds.TE_BeamRingId]: CMsgTEBeamRing;
	[ETEProtobufIds.TE_BSPDecalId]: CMsgTEBSPDecal;
	[ETEProtobufIds.TE_BubblesId]: CMsgTEBubbles;
	[ETEProtobufIds.TE_BubbleTrailId]: CMsgTEBubbleTrail;
	[ETEProtobufIds.TE_DecalId]: CMsgTEDecal;
	[ETEProtobufIds.TE_WorldDecalId]: CMsgTEWorldDecal;
	[ETEProtobufIds.TE_EnergySplashId]: CMsgTEEnergySplash;
	[ETEProtobufIds.TE_FizzId]: CMsgTEFizz;
	[ETEProtobufIds.TE_ShatterSurfaceId]: CMsgTEShatterSurface;
	[ETEProtobufIds.TE_GlowSpriteId]: CMsgTEGlowSprite;
	[ETEProtobufIds.TE_ImpactId]: CMsgTEImpact;
	[ETEProtobufIds.TE_MuzzleFlashId]: CMsgTEMuzzleFlash;
	[ETEProtobufIds.TE_BloodStreamId]: CMsgTEBloodStream;
	[ETEProtobufIds.TE_ExplosionId]: CMsgTEExplosion;
	[ETEProtobufIds.TE_DustId]: CMsgTEDust;
	[ETEProtobufIds.TE_LargeFunnelId]: CMsgTELargeFunnel;
	[ETEProtobufIds.TE_SparksId]: CMsgTESparks;
	[ETEProtobufIds.TE_PhysicsPropId]: CMsgTEPhysicsProp;
	[ETEProtobufIds.TE_PlayerDecalId]: CMsgTEPlayerDecal;
	[ETEProtobufIds.TE_ProjectedDecalId]: CMsgTEProjectedDecal;
	[ETEProtobufIds.TE_SmokeId]: CMsgTESmoke;
}

// Ensure the decoder mapper covers all enum values
export type TempEntityDecodeMapper = {
	[K in ETEProtobufIds]: (data: Uint8Array) => TempEntityDecoderReturnType[K];
};

export function isTempEntity(type: number): type is ETEProtobufIds {
	return ETEProtobufIds[type] !== undefined;
}

export const TempEntityDecoder: TempEntityDecodeMapper = {
	[ETEProtobufIds.TE_EffectDispatchId]: (data: Uint8Array) =>
		fromBinary(CMsgTEEffectDispatchSchema, data),
	[ETEProtobufIds.TE_ArmorRicochetId]: (data: Uint8Array) =>
		fromBinary(CMsgTEArmorRicochetSchema, data),
	[ETEProtobufIds.TE_BeamEntPointId]: (data: Uint8Array) =>
		fromBinary(CMsgTEBeamEntPointSchema, data),
	[ETEProtobufIds.TE_BeamEntsId]: (data: Uint8Array) =>
		fromBinary(CMsgTEBeamEntsSchema, data),
	[ETEProtobufIds.TE_BeamPointsId]: (data: Uint8Array) =>
		fromBinary(CMsgTEBeamPointsSchema, data),
	[ETEProtobufIds.TE_BeamRingId]: (data: Uint8Array) =>
		fromBinary(CMsgTEBeamRingSchema, data),
	[ETEProtobufIds.TE_BSPDecalId]: (data: Uint8Array) =>
		fromBinary(CMsgTEBSPDecalSchema, data),
	[ETEProtobufIds.TE_BubblesId]: (data: Uint8Array) =>
		fromBinary(CMsgTEBubblesSchema, data),
	[ETEProtobufIds.TE_BubbleTrailId]: (data: Uint8Array) =>
		fromBinary(CMsgTEBubbleTrailSchema, data),
	[ETEProtobufIds.TE_DecalId]: (data: Uint8Array) =>
		fromBinary(CMsgTEDecalSchema, data),
	[ETEProtobufIds.TE_WorldDecalId]: (data: Uint8Array) =>
		fromBinary(CMsgTEWorldDecalSchema, data),
	[ETEProtobufIds.TE_EnergySplashId]: (data: Uint8Array) =>
		fromBinary(CMsgTEEnergySplashSchema, data),
	[ETEProtobufIds.TE_FizzId]: (data: Uint8Array) =>
		fromBinary(CMsgTEFizzSchema, data),
	[ETEProtobufIds.TE_ShatterSurfaceId]: (data: Uint8Array) =>
		fromBinary(CMsgTEShatterSurfaceSchema, data),
	[ETEProtobufIds.TE_GlowSpriteId]: (data: Uint8Array) =>
		fromBinary(CMsgTEGlowSpriteSchema, data),
	[ETEProtobufIds.TE_ImpactId]: (data: Uint8Array) =>
		fromBinary(CMsgTEImpactSchema, data),
	[ETEProtobufIds.TE_MuzzleFlashId]: (data: Uint8Array) =>
		fromBinary(CMsgTEMuzzleFlashSchema, data),
	[ETEProtobufIds.TE_BloodStreamId]: (data: Uint8Array) =>
		fromBinary(CMsgTEBloodStreamSchema, data),
	[ETEProtobufIds.TE_ExplosionId]: (data: Uint8Array) =>
		fromBinary(CMsgTEExplosionSchema, data),
	[ETEProtobufIds.TE_DustId]: (data: Uint8Array) =>
		fromBinary(CMsgTEDustSchema, data),
	[ETEProtobufIds.TE_LargeFunnelId]: (data: Uint8Array) =>
		fromBinary(CMsgTELargeFunnelSchema, data),
	[ETEProtobufIds.TE_SparksId]: (data: Uint8Array) =>
		fromBinary(CMsgTESparksSchema, data),
	[ETEProtobufIds.TE_PhysicsPropId]: (data: Uint8Array) =>
		fromBinary(CMsgTEPhysicsPropSchema, data),
	[ETEProtobufIds.TE_PlayerDecalId]: (data: Uint8Array) =>
		fromBinary(CMsgTEPlayerDecalSchema, data),
	[ETEProtobufIds.TE_ProjectedDecalId]: (data: Uint8Array) =>
		fromBinary(CMsgTEProjectedDecalSchema, data),
	[ETEProtobufIds.TE_SmokeId]: (data: Uint8Array) =>
		fromBinary(CMsgTESmokeSchema, data),
} as const;

export function decode<K extends ETEProtobufIds>(
	cmd: K,
	data: Uint8Array
): TempEntityDecoderReturnType[K] {
	return TempEntityDecoder[cmd](data);
}

// Export registry for the analyzer
import type { MessageTypeRegistry } from "./types.ts";

export const registry: MessageTypeRegistry<
	[typeof ETEProtobufIds],
	ETEProtobufIds,
	TempEntityDecoderReturnType
> = {
	enums: [ETEProtobufIds],
	isType: isTempEntity,
	decode: decode,
	name: "TempEntity",
};

export default registry;
