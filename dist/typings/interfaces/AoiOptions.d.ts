import { ClientOptions, GatewayIntentsString } from "discord.js";
import { TimeUnit } from "ms-utility/dist/typings/interfaces/TimeUnit";
import { PrefixOptions } from "./PrefixOptions";
export interface AoiOptions {
    /**
     * Options for the discord.js client.
     */
    client?: ClientOptions;
    /**
     * Whether the compiler should read functions no matter the case.
     * @warning This will slow down compiling phase.
     */
    insensitive?: boolean;
    /**
     * Array of folders where plugins are located.
     */
    plugins?: string[];
    /**
     * Intents for this bot, if no intents are given, this will default to GUILD_MESSAGES and GUILDS.
     * Note that using this property will not have any effect if ClientOptions#intents is given.
     */
    intents?: Array<GatewayIntentsString>;
    /**
     * String to use to log in with.
     */
    token?: string;
    /**
     * Prefixes to use for this bot.
     */
    prefix: string | string[] | PrefixOptions;
    /**
     * Duration units to use when parsing ms to string.
     */
    units?: Array<[string, TimeUnit]>;
}
//# sourceMappingURL=AoiOptions.d.ts.map