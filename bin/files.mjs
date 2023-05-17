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
    js: {
        "index.js": {
            cjs: `
// imports
const { AoiClient } = require("aoi.js");
const dotenv = require("dotenv");
dotenv.config();

const Config = require("./config.js");
const Handler = require("./handler/index.js");
          
// create a new client
const bot = new AoiClient(Config.Client);

// Handler
Handler(bot);
`,
            esm: `
// imports
import { AoiClient } from "aoi.js";
import Config from "./config.js";
import { Commands as CommandHandler,Functions as FunctionHandler }  from "./handler/index.js";

// create a new client
const bot = new AoiClient(Config.Client);

// Handler
await FunctionHandler(bot);
await CommandHandler(bot);
            `,
        },
        "config.js": {
            cjs: `
const { Intents } = require("aoiluna");
const { defaultCacheConfig } = require("aoi.js");
module.exports = {
    Client: {
        token: process.env.TOKEN,
        prefixes: "!",
        intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
        events: ['MessageCreate','Ready'],
        caches: defaultCacheConfig(),
    },
};`,
            esm: `
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
};`,
        },
        commands: {
            "command.template.js": {
                cjs: `
/*
 *   module.exports = {
 *      name: "CommandName",
 *      type: "CommandType",
 *      aliases?: ["CommandAlias"],
 *      code: "CommandCode" | AsyncFunction,
 *   };
*/`,
                esm: `
/*
 *   export default {
 *      name: "CommandName",
 *      type: "CommandType",
 *      aliases?: ["CommandAlias"],
 *      code: "CommandCode" | AsyncFunction,
 *   };
 */`,
            },
        },
    },
    aoi: {
        "index.js": {
            cjs: `
// imports
const { AoiClient } = require("aoi.js");
const dotenv = require("dotenv");
dotenv.config();

const Config = require("./config.js");
const Handler = require("./handler/index.js");

            
// create a new client
const bot = new AoiClient(Config.Client);

// Handler
Handler(bot);
            `,
            esm: `
// imports
import { AoiClient } from "aoi.js";
import Config from "./config.js";
import { Commands as CommandHandler,Functions as FunctionHandler } from "./handler/index.js";

// create a new client
const bot = new AoiClient(Config.Client);

// Handler
await CommandHandler(bot);
await FunctionHandler(bot);
            `,
        },
        "config.js": {
            cjs: `
const { Intents } = require("aoiluna");
const { defaultCacheConfig } = require("aoi.js");
module.exports = {
    Client: {
        token: process.env.TOKEN,
        prefixes: "!",
        intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
        events: ['MessageCreate','Ready'],
        caches: defaultCacheConfig(),
    },
};`,
            esm: `
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
};`,
        },
        commands: {
            "command.template.aoi": `
/*
 *  [exportCommand: CommandType] {
 ?      name: CommandName
 ?      aliases: [CommandAlias]
 ?      code: @{    
 ?          code
 ?      }
 *  }
*/
            `,
        },
    },
};

export default Structure;
