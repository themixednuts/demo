export * from "./parser";
export * from "./broadcast";

import { registry as netMessageBaseRegistry } from "./decoders/netmessage.base";
import { registry as netMessageRegistry } from "./decoders/netmessage";
import { registry as userMessageRegistry } from "./decoders/usermessage";
import { registry as citadelUserMessageRegistry } from "./decoders/citadel_usermessage";
import { registry as gameEventRegistry } from "./decoders/gameevent";
import { registry as tempEntityRegistry } from "./decoders/temp_entity";
import { registry as citadelGameEventRegistry } from "./decoders/citadel_gameevent";
import { registry as demoCommandRegistry } from "./decoders/dem";

export const Registry = {
  DemoCommand: demoCommandRegistry,
  NetMessageBase: netMessageBaseRegistry,
  NetMessage: netMessageRegistry,
  UserMessage: userMessageRegistry,
  CitadelUserMessage: citadelUserMessageRegistry,
  GameEvent: gameEventRegistry,
  TempEntity: tempEntityRegistry,
  CitadelGameEvent: citadelGameEventRegistry,
} as const;
