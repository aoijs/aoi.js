
const { Intents } = require("zeneth");
const { defaultCacheConfig } = require("aoi.js");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    Client: {
        token: process.env.TOKEN,
        prefixes: "!",
        intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
        events: ['MessageCreate','Ready'],
        caches: defaultCacheConfig(),
    },
};