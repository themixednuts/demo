export * from "./parser/index.ts";
export * from "./broadcast/index.ts";

import { registry as netMessageBaseRegistry } from "./decoders/netmessage.base.ts";
import { registry as netMessageRegistry } from "./decoders/netmessage.ts";
import { registry as userMessageRegistry } from "./decoders/usermessage.ts";
import { registry as citadelUserMessageRegistry } from "./decoders/citadel_usermessage.ts";
import { registry as gameEventRegistry } from "./decoders/gameevent.ts";
import { registry as tempEntityRegistry } from "./decoders/temp_entity.ts";
import { registry as citadelGameEventRegistry } from "./decoders/citadel_gameevent.ts";
import { registry as demoCommandRegistry } from "./decoders/dem.ts";

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
