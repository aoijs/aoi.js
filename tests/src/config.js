
import { Intents } from "aoiluna";
import { defaultCacheConfig } from "aoi.js";

export default {
    Client: {
        token: process.env.TOKEN,
        prefixes: "!",
        intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
        events: ['MessageCreate','Ready'],
        caches: defaultCacheConfig(),
    },
};