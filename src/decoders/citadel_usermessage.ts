import { fromBinary } from '@bufbuild/protobuf';
import {
	type CCitadelEntityMsg_BreakablePropSpawnDebris,
	CCitadelEntityMsg_BreakablePropSpawnDebrisSchema,
	type CCitadelUserMessage_AbilityNotify,
	CCitadelUserMessage_AbilityNotifySchema,
	type CCitadelUserMessage_AuraModifierApplied,
	CCitadelUserMessage_AuraModifierAppliedSchema,
	type CCitadelUserMessage_BulletHit,
	CCitadelUserMessage_BulletHitSchema,
	type CCitadelUserMessage_CurrencyChanged,
	CCitadelUserMessage_CurrencyChangedSchema,
	type CCitadelUserMessage_Damage,
	CCitadelUserMessage_DamageSchema,
	type CCitadelUserMessage_GameOver,
	CCitadelUserMessage_GameOverSchema,
	type CCitadelUserMessage_MeleeHit,
	CCitadelUserMessage_MeleeHitSchema,
	type CCitadelUserMessage_ModifierApplied,
	CCitadelUserMessage_ModifierAppliedSchema,
	type CCitadelUserMessage_ObjectiveMask,
	CCitadelUserMessage_ObjectiveMaskSchema,
	type CCitadelUserMsg_AbilitiesChanged,
	CCitadelUserMsg_AbilitiesChangedSchema,
	type CCitadelUserMsg_AbilityInterrupted,
	CCitadelUserMsg_AbilityInterruptedSchema,
	type CCitadelUserMsg_AbilityLateFailure,
	CCitadelUserMsg_AbilityLateFailureSchema,
	type CCitadelUserMsg_AbilityPing,
	CCitadelUserMsg_AbilityPingSchema,
	type CCitadelUserMsg_AG2ParamTrigger,
	CCitadelUserMsg_AG2ParamTriggerSchema,
	type CCitadelUserMsg_BossDamaged,
	CCitadelUserMsg_BossDamagedSchema,
	type CCitadelUserMsg_BossKilled,
	CCitadelUserMsg_BossKilledSchema,
	type CCitadelUserMsg_CallCheaterVote,
	CCitadelUserMsg_CallCheaterVoteSchema,
	type CCitadelUserMsg_CameraController,
	CCitadelUserMsg_CameraControllerSchema,
	type CCitadelUserMsg_ChatEvent,
	CCitadelUserMsg_ChatEventSchema,
	type CCitadelUserMsg_ChatMsg,
	CCitadelUserMsg_ChatMsgSchema,
	type CCitadelUserMsg_ChatWheel,
	CCitadelUserMsg_ChatWheelSchema,
	type CCitadelUserMsg_DeathReplayData,
	CCitadelUserMsg_DeathReplayDataSchema,
	type CCitadelUserMsg_FlexSlotUnlocked,
	CCitadelUserMsg_FlexSlotUnlockedSchema,
	type CCitadelUserMsg_ForceShopClosed,
	CCitadelUserMsg_ForceShopClosedSchema,
	type CCitadelUserMsg_GetDamageStatsResponse,
	CCitadelUserMsg_GetDamageStatsResponseSchema,
	type CCitadelUserMsg_GoldHistory,
	CCitadelUserMsg_GoldHistorySchema,
	type CCitadelUserMsg_HeroKilled,
	CCitadelUserMsg_HeroKilledSchema,
	type CCitadelUserMsg_KillStreak,
	CCitadelUserMsg_KillStreakSchema,
	type CCitadelUserMsg_MapLine,
	CCitadelUserMsg_MapLineSchema,
	type CCitadelUserMsg_MapPing,
	CCitadelUserMsg_MapPingSchema,
	type CCitadelUserMsg_MidBossSpawned,
	CCitadelUserMsg_MidBossSpawnedSchema,
	type CCitadelUserMsg_MusicQueue,
	CCitadelUserMsg_MusicQueueSchema,
	type CCitadelUserMsg_ObstructedShotFired,
	CCitadelUserMsg_ObstructedShotFiredSchema,
	type CCitadelUserMsg_ParticipantSetLibraryStackFields,
	CCitadelUserMsg_ParticipantSetLibraryStackFieldsSchema,
	type CCitadelUserMsg_ParticipantSetSoundEventParams,
	CCitadelUserMsg_ParticipantSetSoundEventParamsSchema,
	type CCitadelUserMsg_ParticipantStartSoundEvent,
	CCitadelUserMsg_ParticipantStartSoundEventSchema,
	type CCitadelUserMsg_ParticipantStopSoundEvent,
	type CCitadelUserMsg_ParticipantStopSoundEventHash,
	CCitadelUserMsg_ParticipantStopSoundEventHashSchema,
	CCitadelUserMsg_ParticipantStopSoundEventSchema,
	type CCitadelUserMsg_PlayerLifetimeStatInfo,
	CCitadelUserMsg_PlayerLifetimeStatInfoSchema,
	type CCitadelUserMsg_PlayerRespawned,
	CCitadelUserMsg_PlayerRespawnedSchema,
	type CCitadelUserMsg_PostMatchDetails,
	CCitadelUserMsg_PostMatchDetailsSchema,
	type CCitadelUserMsg_PostProcessingAnim,
	CCitadelUserMsg_PostProcessingAnimSchema,
	type CCitadelUserMsg_QuickResponse,
	CCitadelUserMsg_QuickResponseSchema,
	type CCitadelUserMsg_RecentDamageSummary,
	CCitadelUserMsg_RecentDamageSummarySchema,
	type CCitadelUserMsg_RejuvStatus,
	CCitadelUserMsg_RejuvStatusSchema,
	type CCitadelUserMsg_ReturnIdol,
	CCitadelUserMsg_ReturnIdolSchema,
	type CCitadelUserMsg_SeasonalAchievementUnlocked,
	CCitadelUserMsg_SeasonalAchievementUnlockedSchema,
	type CCitadelUserMsg_SetClientCameraAngles,
	CCitadelUserMsg_SetClientCameraAnglesSchema,
	type CCitadelUserMsg_SpectatorTeamChanged,
	CCitadelUserMsg_SpectatorTeamChangedSchema,
	type CCitadelUserMsg_StaminaDrained,
	CCitadelUserMsg_StaminaDrainedSchema,
	type CCitadelUserMsg_TeamMsg,
	CCitadelUserMsg_TeamMsgSchema,
	type CCitadelUserMsg_TeamRewards,
	CCitadelUserMsg_TeamRewardsSchema,
	type CCitadelUserMsg_TriggerDamageFlash,
	CCitadelUserMsg_TriggerDamageFlashSchema,
	CitadelEntityMessageIds,
	CitadelUserMessageIds,
} from '@/gen/citadel_usermessages_pb.ts';

export interface CitadelUserMessageDecoderReturnType {
	[CitadelUserMessageIds.k_EUserMsg_Damage]: CCitadelUserMessage_Damage;
	[CitadelUserMessageIds.k_EUserMsg_MapPing]: CCitadelUserMsg_MapPing;
	[CitadelUserMessageIds.k_EUserMsg_TeamRewards]: CCitadelUserMsg_TeamRewards;
	[CitadelUserMessageIds.k_EUserMsg_AbilityFailed]: never;
	[CitadelUserMessageIds.k_EUserMsg_TriggerDamageFlash]:
		CCitadelUserMsg_TriggerDamageFlash;
	[CitadelUserMessageIds.k_EUserMsg_AbilitiesChanged]:
		CCitadelUserMsg_AbilitiesChanged;
	[CitadelUserMessageIds.k_EUserMsg_RecentDamageSummary]:
		CCitadelUserMsg_RecentDamageSummary;
	[CitadelUserMessageIds.k_EUserMsg_SpectatorTeamChanged]:
		CCitadelUserMsg_SpectatorTeamChanged;
	[CitadelUserMessageIds.k_EUserMsg_ChatWheel]: CCitadelUserMsg_ChatWheel;
	[CitadelUserMessageIds.k_EUserMsg_GoldHistory]: CCitadelUserMsg_GoldHistory;
	[CitadelUserMessageIds.k_EUserMsg_ChatMsg]: CCitadelUserMsg_ChatMsg;
	[CitadelUserMessageIds.k_EUserMsg_QuickResponse]:
		CCitadelUserMsg_QuickResponse;
	[CitadelUserMessageIds.k_EUserMsg_PostMatchDetails]:
		CCitadelUserMsg_PostMatchDetails;
	[CitadelUserMessageIds.k_EUserMsg_ChatEvent]: CCitadelUserMsg_ChatEvent;
	[CitadelUserMessageIds.k_EUserMsg_AbilityInterrupted]:
		CCitadelUserMsg_AbilityInterrupted;
	[CitadelUserMessageIds.k_EUserMsg_HeroKilled]: CCitadelUserMsg_HeroKilled;
	[CitadelUserMessageIds.k_EUserMsg_ReturnIdol]: CCitadelUserMsg_ReturnIdol;
	[CitadelUserMessageIds.k_EUserMsg_SetClientCameraAngles]:
		CCitadelUserMsg_SetClientCameraAngles;
	[CitadelUserMessageIds.k_EUserMsg_MapLine]: CCitadelUserMsg_MapLine;
	[CitadelUserMessageIds.k_EUserMsg_BulletHit]: CCitadelUserMessage_BulletHit;
	[CitadelUserMessageIds.k_EUserMsg_ObjectiveMask]:
		CCitadelUserMessage_ObjectiveMask;
	[CitadelUserMessageIds.k_EUserMsg_ModifierApplied]:
		CCitadelUserMessage_ModifierApplied;
	[CitadelUserMessageIds.k_EUserMsg_CameraController]:
		CCitadelUserMsg_CameraController;
	[CitadelUserMessageIds.k_EUserMsg_AuraModifierApplied]:
		CCitadelUserMessage_AuraModifierApplied;
	[CitadelUserMessageIds.k_EUserMsg_ObstructedShotFired]:
		CCitadelUserMsg_ObstructedShotFired;
	[CitadelUserMessageIds.k_EUserMsg_AbilityLateFailure]:
		CCitadelUserMsg_AbilityLateFailure;
	[CitadelUserMessageIds.k_EUserMsg_AbilityPing]: CCitadelUserMsg_AbilityPing;
	[CitadelUserMessageIds.k_EUserMsg_PostProcessingAnim]:
		CCitadelUserMsg_PostProcessingAnim;
	[CitadelUserMessageIds.k_EUserMsg_DeathReplayData]:
		CCitadelUserMsg_DeathReplayData;
	[CitadelUserMessageIds.k_EUserMsg_PlayerLifetimeStatInfo]:
		CCitadelUserMsg_PlayerLifetimeStatInfo;
	[CitadelUserMessageIds.k_EUserMsg_ForceShopClosed]:
		CCitadelUserMsg_ForceShopClosed;
	[CitadelUserMessageIds.k_EUserMsg_StaminaDrained]:
		CCitadelUserMsg_StaminaDrained;
	[CitadelUserMessageIds.k_EUserMsg_AbilityNotify]:
		CCitadelUserMessage_AbilityNotify;
	[CitadelUserMessageIds.k_EUserMsg_GetDamageStatsResponse]:
		CCitadelUserMsg_GetDamageStatsResponse;
	[CitadelUserMessageIds.k_EUserMsg_ParticipantStartSoundEvent]:
		CCitadelUserMsg_ParticipantStartSoundEvent;
	[CitadelUserMessageIds.k_EUserMsg_ParticipantStopSoundEvent]:
		CCitadelUserMsg_ParticipantStopSoundEvent;
	[CitadelUserMessageIds.k_EUserMsg_ParticipantStopSoundEventHash]:
		CCitadelUserMsg_ParticipantStopSoundEventHash;
	[CitadelUserMessageIds.k_EUserMsg_ParticipantSetSoundEventParams]:
		CCitadelUserMsg_ParticipantSetSoundEventParams;
	[CitadelUserMessageIds.k_EUserMsg_ParticipantSetLibraryStackFields]:
		CCitadelUserMsg_ParticipantSetLibraryStackFields;
	[CitadelUserMessageIds.k_EUserMsg_CurrencyChanged]:
		CCitadelUserMessage_CurrencyChanged;
	[CitadelUserMessageIds.k_EUserMsg_GameOver]: CCitadelUserMessage_GameOver;
	[CitadelUserMessageIds.k_EUserMsg_BossKilled]: CCitadelUserMsg_BossKilled;
	[CitadelUserMessageIds.k_EUserMsg_BossDamaged]: CCitadelUserMsg_BossDamaged;
	[CitadelUserMessageIds.k_EUserMsg_MidBossSpawned]:
		CCitadelUserMsg_MidBossSpawned;
	[CitadelUserMessageIds.k_EUserMsg_RejuvStatus]: CCitadelUserMsg_RejuvStatus;
	[CitadelUserMessageIds.k_EUserMsg_KillStreak]: CCitadelUserMsg_KillStreak;
	[CitadelUserMessageIds.k_EUserMsg_TeamMsg]: CCitadelUserMsg_TeamMsg;
	[CitadelUserMessageIds.k_EUserMsg_PlayerRespawned]:
		CCitadelUserMsg_PlayerRespawned;
	[CitadelUserMessageIds.k_EUserMsg_CallCheaterVote]:
		CCitadelUserMsg_CallCheaterVote;
	[CitadelUserMessageIds.k_EUserMsg_MeleeHit]: CCitadelUserMessage_MeleeHit;
	[CitadelUserMessageIds.k_EUserMsg_FlexSlotUnlocked]:
		CCitadelUserMsg_FlexSlotUnlocked;
	[CitadelUserMessageIds.k_EUserMsg_SeasonalAchievementUnlocked]:
		CCitadelUserMsg_SeasonalAchievementUnlocked;
	[CitadelUserMessageIds.k_EUserMsg_MusicQueue]: CCitadelUserMsg_MusicQueue;
	[CitadelUserMessageIds.k_EUserMsg_AG2ParamTrigger]:
		CCitadelUserMsg_AG2ParamTrigger;
	[CitadelEntityMessageIds.k_EEntityMsg_BreakablePropSpawnDebris]:
		CCitadelEntityMsg_BreakablePropSpawnDebris;
}

type AllMessages = CitadelUserMessageIds | CitadelEntityMessageIds;

export type CitadelUserMessageDecodeMapper = {
	[K in AllMessages]: (
		data: Uint8Array,
	) => CitadelUserMessageDecoderReturnType[K];
};

export function isCitadelUserMessage(
	type: number,
): type is CitadelUserMessageIds {
	return CitadelUserMessageIds[type] !== undefined;
}

export const CitadelUserMessageDecoder: CitadelUserMessageDecodeMapper = {
	[CitadelUserMessageIds.k_EUserMsg_Damage]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMessage_DamageSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_MapPing]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_MapPingSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_TeamRewards]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_TeamRewardsSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_AbilityFailed]: (
		data: Uint8Array,
	): never => {
		throw new Error('Function not implemented. k_EUserMsg_AbilityFailed');
	},
	[CitadelUserMessageIds.k_EUserMsg_TriggerDamageFlash]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_TriggerDamageFlashSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_AbilitiesChanged]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_AbilitiesChangedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_RecentDamageSummary]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_RecentDamageSummarySchema, data),
	[CitadelUserMessageIds.k_EUserMsg_SpectatorTeamChanged]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_SpectatorTeamChangedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ChatWheel]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_ChatWheelSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_GoldHistory]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_GoldHistorySchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ChatMsg]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_ChatMsgSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_QuickResponse]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_QuickResponseSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_PostMatchDetails]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_PostMatchDetailsSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ChatEvent]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_ChatEventSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_AbilityInterrupted]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_AbilityInterruptedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_HeroKilled]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_HeroKilledSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ReturnIdol]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_ReturnIdolSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_SetClientCameraAngles]: (
		data: Uint8Array,
	) => fromBinary(CCitadelUserMsg_SetClientCameraAnglesSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_MapLine]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_MapLineSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_BulletHit]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMessage_BulletHitSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ObjectiveMask]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMessage_ObjectiveMaskSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ModifierApplied]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMessage_ModifierAppliedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_CameraController]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_CameraControllerSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_AuraModifierApplied]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMessage_AuraModifierAppliedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ObstructedShotFired]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_ObstructedShotFiredSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_AbilityLateFailure]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_AbilityLateFailureSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_AbilityPing]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_AbilityPingSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_PostProcessingAnim]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_PostProcessingAnimSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_DeathReplayData]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_DeathReplayDataSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_PlayerLifetimeStatInfo]: (
		data: Uint8Array,
	) => fromBinary(CCitadelUserMsg_PlayerLifetimeStatInfoSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ForceShopClosed]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_ForceShopClosedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_StaminaDrained]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_StaminaDrainedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_AbilityNotify]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMessage_AbilityNotifySchema, data),
	[CitadelUserMessageIds.k_EUserMsg_GetDamageStatsResponse]: (
		data: Uint8Array,
	) => fromBinary(CCitadelUserMsg_GetDamageStatsResponseSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ParticipantStartSoundEvent]: (
		data: Uint8Array,
	) => fromBinary(CCitadelUserMsg_ParticipantStartSoundEventSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ParticipantStopSoundEvent]: (
		data: Uint8Array,
	) => fromBinary(CCitadelUserMsg_ParticipantStopSoundEventSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ParticipantStopSoundEventHash]: (
		data: Uint8Array,
	) => fromBinary(CCitadelUserMsg_ParticipantStopSoundEventHashSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ParticipantSetSoundEventParams]: (
		data: Uint8Array,
	) => fromBinary(CCitadelUserMsg_ParticipantSetSoundEventParamsSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_ParticipantSetLibraryStackFields]: (
		data: Uint8Array,
	) => fromBinary(CCitadelUserMsg_ParticipantSetLibraryStackFieldsSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_CurrencyChanged]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMessage_CurrencyChangedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_GameOver]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMessage_GameOverSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_BossKilled]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_BossKilledSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_BossDamaged]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_BossDamagedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_MidBossSpawned]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_MidBossSpawnedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_RejuvStatus]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_RejuvStatusSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_KillStreak]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_KillStreakSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_TeamMsg]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_TeamMsgSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_PlayerRespawned]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_PlayerRespawnedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_CallCheaterVote]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_CallCheaterVoteSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_MeleeHit]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMessage_MeleeHitSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_FlexSlotUnlocked]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_FlexSlotUnlockedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_SeasonalAchievementUnlocked]: (
		data: Uint8Array,
	) => fromBinary(CCitadelUserMsg_SeasonalAchievementUnlockedSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_MusicQueue]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_MusicQueueSchema, data),
	[CitadelUserMessageIds.k_EUserMsg_AG2ParamTrigger]: (data: Uint8Array) =>
		fromBinary(CCitadelUserMsg_AG2ParamTriggerSchema, data),
	[CitadelEntityMessageIds.k_EEntityMsg_BreakablePropSpawnDebris]: (
		data: Uint8Array,
	) => fromBinary(CCitadelEntityMsg_BreakablePropSpawnDebrisSchema, data),
} as const;

export function decode<K extends AllMessages>(
	cmd: K,
	data: Uint8Array,
): CitadelUserMessageDecoderReturnType[K] {
	return CitadelUserMessageDecoder[cmd](data);
}

// Export registry for the analyzer
import type { MessageTypeRegistry } from './types.ts';

export const registry: MessageTypeRegistry<
	[typeof CitadelUserMessageIds, typeof CitadelEntityMessageIds],
	AllMessages,
	CitadelUserMessageDecoderReturnType
> = {
	enums: [CitadelUserMessageIds, CitadelEntityMessageIds],
	isType: isCitadelUserMessage,
	decode: decode,
	name: 'CitadelUserMessage',
} as const;

export default registry;
