import { ClientEvents } from "discord.js";
import { DiscordEvent } from "../../typings/types/DiscordEvent";
export declare function createDiscordEventHandler<T extends keyof ClientEvents>(event: T, handler: DiscordEvent<T>): DiscordEvent<T>;
//# sourceMappingURL=createDiscordEventHandler.d.ts.map