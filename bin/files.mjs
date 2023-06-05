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
import { commandHandler } from "./handler/index.js";

const bot = new Client( config.Client );
await commandHandler( bot );
        `,
        "config.js": `
import { Intents } from "aoiluna";
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
        "handler/index.js": `
const commandHandler = async (bot) => {
    await bot.managers.commands.load({ path: "./commands" });
}`,
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
const { commandHandler } = require("./handler");

const bot = new Client( config.Client );

(async () => {
    await commandHandler( bot );
})();
`,
        "config.js": `
const { Intents } = require("aoiluna");
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
        "handler/index.js": `
const commandHandler = async (bot) => {
    await bot.managers.commands.load({ path: "./commands" });
};

module.exports = {
    commandHandler,
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
            "handler/index.js": `
const commandHandler = async (bot) => {
     await bot.managers.commands.load({ path: "./commands", usingAoi: true });
};

export {
    commandHandler,
}
            `,
        },
        cjs: {
            "handler/index.js": `
        const commandHandler = async (bot) => {
            await bot.managers.commands.load({ path: "./commands", usingAoi: true });
        };
        
        module.exports = {
            commandHandler,
        };`,
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
