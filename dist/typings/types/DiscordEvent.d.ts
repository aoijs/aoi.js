import { ClientEvents } from "discord.js";
import { AoiClient } from "../../core";
import { Async } from "./Async";
export declare type DiscordEvent<T extends keyof ClientEvents> = (this: AoiClient, ...args: ClientEvents[T]) => Async<void>;
//# sourceMappingURL=DiscordEvent.d.ts.map