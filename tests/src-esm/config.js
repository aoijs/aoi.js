
import { Intents } from "zeneth";
import { defaultCacheConfig } from "aoi.js";
import dotenv from "dotenv";

dotenv.config();

export default {
    Client: {
        token: process.env.TOKEN,
        prefixes: "!",
        intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
        events: ['MessageCreate','Ready'],
        caches: defaultCacheConfig(),
    },
};