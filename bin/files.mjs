/*
 *   |- src (js)
 ?       - index.js
 *       - commands
 !           - command.template.js
 ?       - config.js
 *       - customFunctions
 !           - customFunction.template.js
 *       - voice
 !           - voice.template.js
 *       - handler
 ?           - commands.js
 ?           - functions.js
 ?           - index.js

*/

/*
 *  |- src (aoi)
 ?     - index.js
 *     - commands
 !         - command.template.aoi
 ?     - config.js
 *     - customFunctions
 !         - customFunction.template.aoi
 *     - voice
 !         - voice.template.aoi
 *     - handler
 ?         - commands.js
 ?         - functions.js
 ?         - index.js
*/

const Structure = {
    esm: {
        "index.js": `
import { Client } from "aoi.js";
import config from "./config.js";

const bot = new Client( config.Client );

await bot.managers.commands.load({ path: "./commands" });
        `,
        "config.js": `
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
};`,
        "commands/command.template.js": `
export default {
    name: "CommandName",
    aliases: ["CommandAliases"], //optional
    type: "CommandType", 
    code: \`CommandCode\`
};
`,
    },
    cjs: {
        "index.js": `
const { Client } = require("aoi.js");
const config = require("./config.js");

const bot = new Client( config.Client );

(async () => {
    await bot.managers.commands.load({ path: "./commands" });
})();
`,
        "config.js": `
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
};`,
        "commands/command.template.js": `
module.exports = {
    name: "CommandName",
    aliases: ["CommandAliases"], //optional
    type: "CommandType",
    code: \`CommandCode\`
};
`,
    },
    aoi: {
        esm: {
            "index.js": `
import { Client } from "aoi.js";
import config from "./config.js";

const bot = new Client( config.Client );

await bot.managers.commands.load({ path: "./commands", usingAoi: true });
        `,
        },
        cjs: {
            "index.js": `
const { Client } = require("aoi.js");
const config = require("./config.js");

const bot = new Client( config.Client );

(async () => {
    await bot.managers.commands.load({ path: "./commands", usingAoi: true });
})();
`,
        },
        "commands/command.template.aoi": `
[exportCommand: CommandType] {
    name: CommandName
    aliases: CommandAliases
    code: CommandCode
}`,
    },
};

export default Structure;
