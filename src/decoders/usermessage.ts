import { fromBinary } from "@bufbuild/protobuf";
import {
  type CEntityMessageDoSpark,
  CEntityMessageDoSparkSchema,
  type CEntityMessageFixAngle,
  CEntityMessageFixAngleSchema,
  type CEntityMessagePlayJingle,
  CEntityMessagePlayJingleSchema,
  type CEntityMessagePropagateForce,
  CEntityMessagePropagateForceSchema,
  type CEntityMessageRemoveAllDecals,
  CEntityMessageRemoveAllDecalsSchema,
  type CEntityMessageScreenOverlay,
  CEntityMessageScreenOverlaySchema,
  type CUserMessage_DllStatus,
  CUserMessage_DllStatusSchema,
  type CUserMessage_Inventory_Response,
  CUserMessage_Inventory_ResponseSchema,
  type CUserMessage_UtilMsg_Response,
  CUserMessage_UtilMsg_ResponseSchema,
  type CUserMessageAchievementEvent,
  CUserMessageAchievementEventSchema,
  type CUserMessageAmmoDenied,
  CUserMessageAmmoDeniedSchema,
  type CUserMessageAnimStateGraphState,
  CUserMessageAnimStateGraphStateSchema,
  type CUserMessageAudioParameter,
  CUserMessageAudioParameterSchema,
  type CUserMessageCameraTransition,
  CUserMessageCameraTransitionSchema,
  type CUserMessageCloseCaption,
  CUserMessageCloseCaptionSchema,
  type CUserMessageCloseCaptionDirect,
  CUserMessageCloseCaptionDirectSchema,
  type CUserMessageCloseCaptionPlaceholder,
  CUserMessageCloseCaptionPlaceholderSchema,
  type CUserMessageColoredText,
  CUserMessageColoredTextSchema,
  type CUserMessageCreditsMsg,
  CUserMessageCreditsMsgSchema,
  type CUserMessageCurrentTimescale,
  CUserMessageCurrentTimescaleSchema,
  type CUserMessageDesiredTimescale,
  CUserMessageDesiredTimescaleSchema,
  type CUserMessageFade,
  CUserMessageFadeSchema,
  type CUserMessageGameTitle,
  CUserMessageGameTitleSchema,
  type CUserMessageHapticsManagerEffect,
  CUserMessageHapticsManagerEffectSchema,
  type CUserMessageHapticsManagerPulse,
  CUserMessageHapticsManagerPulseSchema,
  type CUserMessageHudMsg,
  CUserMessageHudMsgSchema,
  type CUserMessageHudText,
  CUserMessageHudTextSchema,
  type CUserMessageItemPickup,
  CUserMessageItemPickupSchema,
  type CUserMessageLagCompensationError,
  CUserMessageLagCompensationErrorSchema,
  type CUserMessageRequestDiagnostic,
  CUserMessageRequestDiagnosticSchema,
  type CUserMessageRequestDllStatus,
  CUserMessageRequestDllStatusSchema,
  type CUserMessageRequestInventory,
  CUserMessageRequestInventorySchema,
  type CUserMessageRequestState,
  CUserMessageRequestStateSchema,
  type CUserMessageRequestUtilAction,
  CUserMessageRequestUtilActionSchema,
  type CUserMessageResetHUD,
  CUserMessageResetHUDSchema,
  type CUserMessageRumble,
  CUserMessageRumbleSchema,
  type CUserMessageSayText,
  CUserMessageSayTextSchema,
  type CUserMessageSayText2,
  CUserMessageSayText2Schema,
  type CUserMessageSayTextChannel,
  CUserMessageSayTextChannelSchema,
  type CUserMessageScreenTilt,
  CUserMessageScreenTiltSchema,
  type CUserMessageSendAudio,
  CUserMessageSendAudioSchema,
  type CUserMessageServerFrameTime,
  CUserMessageServerFrameTimeSchema,
  type CUserMessageShake,
  CUserMessageShakeSchema,
  type CUserMessageShakeDir,
  CUserMessageShakeDirSchema,
  type CUserMessageShowMenu,
  CUserMessageShowMenuSchema,
  type CUserMessageTextMsg,
  CUserMessageTextMsgSchema,
  type CUserMessageUpdateCssClasses,
  CUserMessageUpdateCssClassesSchema,
  type CUserMessageVoiceMask,
  CUserMessageVoiceMaskSchema,
  type CUserMessageWaterShake,
  CUserMessageWaterShakeSchema,
  type CUserMsg_CustomGameEvent,
  CUserMsg_CustomGameEventSchema,
  type CUserMsg_HudError,
  CUserMsg_HudErrorSchema,
  type CUserMsg_ParticleManager,
  CUserMsg_ParticleManagerSchema,
  EBaseEntityMessages,
  EBaseUserMessages,
} from "@/gen/usermessages_pb";

// Union type for all user message enums
type AllUserMessages = EBaseUserMessages | EBaseEntityMessages;
// | CitadelUserMessageIds;

// Clean interface mapping for user message return types
export interface DecoderReturnType {
  [EBaseUserMessages.UM_AchievementEvent]: CUserMessageAchievementEvent;
  [EBaseUserMessages.UM_CloseCaption]: CUserMessageCloseCaption;
  [EBaseUserMessages.UM_CloseCaptionDirect]: CUserMessageCloseCaptionDirect;
  [EBaseUserMessages.UM_CurrentTimescale]: CUserMessageCurrentTimescale;
  [EBaseUserMessages.UM_DesiredTimescale]: CUserMessageDesiredTimescale;
  [EBaseUserMessages.UM_Fade]: CUserMessageFade;
  [EBaseUserMessages.UM_GameTitle]: CUserMessageGameTitle;
  [EBaseUserMessages.UM_HudMsg]: CUserMessageHudMsg;
  [EBaseUserMessages.UM_HudText]: CUserMessageHudText;
  [EBaseUserMessages.UM_ColoredText]: CUserMessageColoredText;
  [EBaseUserMessages.UM_RequestState]: CUserMessageRequestState;
  [EBaseUserMessages.UM_ResetHUD]: CUserMessageResetHUD;
  [EBaseUserMessages.UM_Rumble]: CUserMessageRumble;
  [EBaseUserMessages.UM_SayText]: CUserMessageSayText;
  [EBaseUserMessages.UM_SayText2]: CUserMessageSayText2;
  [EBaseUserMessages.UM_SayTextChannel]: CUserMessageSayTextChannel;
  [EBaseUserMessages.UM_Shake]: CUserMessageShake;
  [EBaseUserMessages.UM_ShakeDir]: CUserMessageShakeDir;
  [EBaseUserMessages.UM_WaterShake]: CUserMessageWaterShake;
  [EBaseUserMessages.UM_TextMsg]: CUserMessageTextMsg;
  [EBaseUserMessages.UM_ScreenTilt]: CUserMessageScreenTilt;
  [EBaseUserMessages.UM_VoiceMask]: CUserMessageVoiceMask;
  [EBaseUserMessages.UM_SendAudio]: CUserMessageSendAudio;
  [EBaseUserMessages.UM_ItemPickup]: CUserMessageItemPickup;
  [EBaseUserMessages.UM_AmmoDenied]: CUserMessageAmmoDenied;
  [EBaseUserMessages.UM_ShowMenu]: CUserMessageShowMenu;
  [EBaseUserMessages.UM_CreditsMsg]: CUserMessageCreditsMsg;
  [EBaseUserMessages.UM_CloseCaptionPlaceholder]: CUserMessageCloseCaptionPlaceholder;
  [EBaseUserMessages.UM_CameraTransition]: CUserMessageCameraTransition;
  [EBaseUserMessages.UM_AudioParameter]: CUserMessageAudioParameter;
  [EBaseUserMessages.UM_ParticleManager]: CUserMsg_ParticleManager;
  [EBaseUserMessages.UM_HudError]: CUserMsg_HudError;
  [EBaseUserMessages.UM_CustomGameEvent]: CUserMsg_CustomGameEvent;
  [EBaseUserMessages.UM_AnimGraphUpdate]: CUserMessageAnimStateGraphState;
  [EBaseUserMessages.UM_HapticsManagerPulse]: CUserMessageHapticsManagerPulse;
  [EBaseUserMessages.UM_HapticsManagerEffect]: CUserMessageHapticsManagerEffect;
  [EBaseUserMessages.UM_UpdateCssClasses]: CUserMessageUpdateCssClasses;
  [EBaseUserMessages.UM_ServerFrameTime]: CUserMessageServerFrameTime;
  [EBaseUserMessages.UM_LagCompensationError]: CUserMessageLagCompensationError;
  [EBaseUserMessages.UM_RequestDllStatus]: CUserMessageRequestDllStatus;
  [EBaseUserMessages.UM_RequestUtilAction]: CUserMessageRequestUtilAction;
  [EBaseUserMessages.UM_UtilActionResponse]: CUserMessage_UtilMsg_Response;
  [EBaseUserMessages.UM_DllStatusResponse]: CUserMessage_DllStatus;
  [EBaseUserMessages.UM_RequestInventory]: CUserMessageRequestInventory;
  [EBaseUserMessages.UM_InventoryResponse]: CUserMessage_Inventory_Response;
  [EBaseUserMessages.UM_RequestDiagnostic]: CUserMessageRequestDiagnostic;
  [EBaseUserMessages.UM_DiagnosticResponse]: never;
  [EBaseUserMessages.UM_ExtraUserData]: never;
  [EBaseUserMessages.UM_NotifyResponseFound]: never;
  [EBaseUserMessages.UM_PlayResponseConditional]: never;
  [EBaseUserMessages.UM_MAX_BASE]: never;
  [EBaseEntityMessages.EM_PlayJingle]: CEntityMessagePlayJingle;
  [EBaseEntityMessages.EM_ScreenOverlay]: CEntityMessageScreenOverlay;
  [EBaseEntityMessages.EM_RemoveAllDecals]: CEntityMessageRemoveAllDecals;
  [EBaseEntityMessages.EM_PropagateForce]: CEntityMessagePropagateForce;
  [EBaseEntityMessages.EM_DoSpark]: CEntityMessageDoSpark;
  [EBaseEntityMessages.EM_FixAngle]: CEntityMessageFixAngle;
}

export type DecodeMapper = {
  [K in AllUserMessages]: (data: Uint8Array) => DecoderReturnType[K];
};

export function isUserMessage(type: number): type is AllUserMessages {
  return (
    EBaseUserMessages[type] !== undefined ||
    EBaseEntityMessages[type] !== undefined
  );
}

export const UserMessageDecoder: DecodeMapper = {
  // Base User Messages
  [EBaseUserMessages.UM_AchievementEvent]: (data: Uint8Array) =>
    fromBinary(CUserMessageAchievementEventSchema, data),
  [EBaseUserMessages.UM_CloseCaption]: (data: Uint8Array) =>
    fromBinary(CUserMessageCloseCaptionSchema, data),
  [EBaseUserMessages.UM_CloseCaptionDirect]: (data: Uint8Array) =>
    fromBinary(CUserMessageCloseCaptionDirectSchema, data),
  [EBaseUserMessages.UM_CurrentTimescale]: (data: Uint8Array) =>
    fromBinary(CUserMessageCurrentTimescaleSchema, data),
  [EBaseUserMessages.UM_DesiredTimescale]: (data: Uint8Array) =>
    fromBinary(CUserMessageDesiredTimescaleSchema, data),
  [EBaseUserMessages.UM_Fade]: (data: Uint8Array) =>
    fromBinary(CUserMessageFadeSchema, data),
  [EBaseUserMessages.UM_GameTitle]: (data: Uint8Array) =>
    fromBinary(CUserMessageGameTitleSchema, data),
  [EBaseUserMessages.UM_HudMsg]: (data: Uint8Array) =>
    fromBinary(CUserMessageHudMsgSchema, data),
  [EBaseUserMessages.UM_HudText]: (data: Uint8Array) =>
    fromBinary(CUserMessageHudTextSchema, data),
  [EBaseUserMessages.UM_ColoredText]: (data: Uint8Array) =>
    fromBinary(CUserMessageColoredTextSchema, data),
  [EBaseUserMessages.UM_RequestState]: (data: Uint8Array) =>
    fromBinary(CUserMessageRequestStateSchema, data),
  [EBaseUserMessages.UM_ResetHUD]: (data: Uint8Array) =>
    fromBinary(CUserMessageResetHUDSchema, data),
  [EBaseUserMessages.UM_Rumble]: (data: Uint8Array) =>
    fromBinary(CUserMessageRumbleSchema, data),
  [EBaseUserMessages.UM_SayText]: (data: Uint8Array) =>
    fromBinary(CUserMessageSayTextSchema, data),
  [EBaseUserMessages.UM_SayText2]: (data: Uint8Array) =>
    fromBinary(CUserMessageSayText2Schema, data),
  [EBaseUserMessages.UM_SayTextChannel]: (data: Uint8Array) =>
    fromBinary(CUserMessageSayTextChannelSchema, data),
  [EBaseUserMessages.UM_Shake]: (data: Uint8Array) =>
    fromBinary(CUserMessageShakeSchema, data),
  [EBaseUserMessages.UM_ShakeDir]: (data: Uint8Array) =>
    fromBinary(CUserMessageShakeDirSchema, data),
  [EBaseUserMessages.UM_WaterShake]: (data: Uint8Array) =>
    fromBinary(CUserMessageWaterShakeSchema, data),
  [EBaseUserMessages.UM_TextMsg]: (data: Uint8Array) =>
    fromBinary(CUserMessageTextMsgSchema, data),
  [EBaseUserMessages.UM_ScreenTilt]: (data: Uint8Array) =>
    fromBinary(CUserMessageScreenTiltSchema, data),
  [EBaseUserMessages.UM_VoiceMask]: (data: Uint8Array) =>
    fromBinary(CUserMessageVoiceMaskSchema, data),
  [EBaseUserMessages.UM_SendAudio]: (data: Uint8Array) =>
    fromBinary(CUserMessageSendAudioSchema, data),
  [EBaseUserMessages.UM_ItemPickup]: (data: Uint8Array) =>
    fromBinary(CUserMessageItemPickupSchema, data),
  [EBaseUserMessages.UM_AmmoDenied]: (data: Uint8Array) =>
    fromBinary(CUserMessageAmmoDeniedSchema, data),
  [EBaseUserMessages.UM_ShowMenu]: (data: Uint8Array) =>
    fromBinary(CUserMessageShowMenuSchema, data),
  [EBaseUserMessages.UM_CreditsMsg]: (data: Uint8Array) =>
    fromBinary(CUserMessageCreditsMsgSchema, data),
  [EBaseUserMessages.UM_CloseCaptionPlaceholder]: (data: Uint8Array) =>
    fromBinary(CUserMessageCloseCaptionPlaceholderSchema, data),
  [EBaseUserMessages.UM_CameraTransition]: (data: Uint8Array) =>
    fromBinary(CUserMessageCameraTransitionSchema, data),
  [EBaseUserMessages.UM_AudioParameter]: (data: Uint8Array) =>
    fromBinary(CUserMessageAudioParameterSchema, data),
  [EBaseUserMessages.UM_ParticleManager]: (data: Uint8Array) =>
    fromBinary(CUserMsg_ParticleManagerSchema, data),
  [EBaseUserMessages.UM_HudError]: (data: Uint8Array) =>
    fromBinary(CUserMsg_HudErrorSchema, data),
  [EBaseUserMessages.UM_CustomGameEvent]: (data: Uint8Array) =>
    fromBinary(CUserMsg_CustomGameEventSchema, data),
  [EBaseUserMessages.UM_AnimGraphUpdate]: (data: Uint8Array) =>
    fromBinary(CUserMessageAnimStateGraphStateSchema, data),
  [EBaseUserMessages.UM_HapticsManagerPulse]: (data: Uint8Array) =>
    fromBinary(CUserMessageHapticsManagerPulseSchema, data),
  [EBaseUserMessages.UM_HapticsManagerEffect]: (data: Uint8Array) =>
    fromBinary(CUserMessageHapticsManagerEffectSchema, data),
  [EBaseUserMessages.UM_UpdateCssClasses]: (data: Uint8Array) =>
    fromBinary(CUserMessageUpdateCssClassesSchema, data),
  [EBaseUserMessages.UM_ServerFrameTime]: (data: Uint8Array) =>
    fromBinary(CUserMessageServerFrameTimeSchema, data),
  [EBaseUserMessages.UM_LagCompensationError]: (data: Uint8Array) =>
    fromBinary(CUserMessageLagCompensationErrorSchema, data),
  [EBaseUserMessages.UM_RequestDllStatus]: (data: Uint8Array) =>
    fromBinary(CUserMessageRequestDllStatusSchema, data),
  [EBaseUserMessages.UM_RequestUtilAction]: (data: Uint8Array) =>
    fromBinary(CUserMessageRequestUtilActionSchema, data),
  [EBaseUserMessages.UM_UtilActionResponse]: (data: Uint8Array) =>
    fromBinary(CUserMessage_UtilMsg_ResponseSchema, data),
  [EBaseUserMessages.UM_DllStatusResponse]: (data: Uint8Array) =>
    fromBinary(CUserMessage_DllStatusSchema, data),
  [EBaseUserMessages.UM_RequestInventory]: (data: Uint8Array) =>
    fromBinary(CUserMessageRequestInventorySchema, data),
  [EBaseUserMessages.UM_InventoryResponse]: (data: Uint8Array) =>
    fromBinary(CUserMessage_Inventory_ResponseSchema, data),
  [EBaseUserMessages.UM_RequestDiagnostic]: (data: Uint8Array) =>
    fromBinary(CUserMessageRequestDiagnosticSchema, data),
  [EBaseUserMessages.UM_DiagnosticResponse]: (data: Uint8Array): never => {
    throw new Error("Function not implemented.");
  },
  [EBaseUserMessages.UM_ExtraUserData]: (data: Uint8Array): never => {
    throw new Error("Function not implemented.");
  },
  [EBaseUserMessages.UM_NotifyResponseFound]: (data: Uint8Array): never => {
    throw new Error("Function not implemented.");
  },
  [EBaseUserMessages.UM_PlayResponseConditional]: (data: Uint8Array): never => {
    throw new Error("Function not implemented.");
  },
  [EBaseUserMessages.UM_MAX_BASE]: (data: Uint8Array): never => {
    throw new Error("Function not implemented.");
  },

  // Base Entity Messages
  [EBaseEntityMessages.EM_PlayJingle]: (data: Uint8Array) =>
    fromBinary(CEntityMessagePlayJingleSchema, data),
  [EBaseEntityMessages.EM_ScreenOverlay]: (data: Uint8Array) =>
    fromBinary(CEntityMessageScreenOverlaySchema, data),
  [EBaseEntityMessages.EM_RemoveAllDecals]: (data: Uint8Array) =>
    fromBinary(CEntityMessageRemoveAllDecalsSchema, data),
  [EBaseEntityMessages.EM_PropagateForce]: (data: Uint8Array) =>
    fromBinary(CEntityMessagePropagateForceSchema, data),
  [EBaseEntityMessages.EM_DoSpark]: (data: Uint8Array) =>
    fromBinary(CEntityMessageDoSparkSchema, data),
  [EBaseEntityMessages.EM_FixAngle]: (data: Uint8Array) =>
    fromBinary(CEntityMessageFixAngleSchema, data),
} as const;

export function decode<K extends AllUserMessages>(
  cmd: K,
  data: Uint8Array,
): DecoderReturnType[K] {
  return UserMessageDecoder[cmd](data);
}

// Export registry for the analyzer
import type { MessageTypeRegistry } from "./types";

export const registry: MessageTypeRegistry<
  [typeof EBaseUserMessages, typeof EBaseEntityMessages],
  AllUserMessages,
  DecoderReturnType
> = {
  enums: [EBaseUserMessages, EBaseEntityMessages],
  isType: isUserMessage,
  decode: decode,
  name: "UserMessage",
};

export default registry;
