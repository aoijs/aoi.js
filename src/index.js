const Client = require("./classes/Bot.js");
const CustomEvent = require("./classes/NewEvent.js");
const LoadCommands = require("./classes/LoadCommands.js");
const ClientShard = require("./classes/ClientShard.js");
const Voice = require("./classes/Voice.js");
const Lavalink = require("./classes/Lavalink.js");
const AoiError = require("./classes/AoiError.js");
const Util = require("./classes/Util.js");
module.exports = {
    /**
     * * The Discord Bot Client
     * @param {!Object} options The options to use Discord as a Bot
     * @example new Bot({
     * 				token:"Discord Bot Token",
     * 				prefix:"!",
     * 				intents : ['GUILDS','GUILD_MESSAGES']
     * 			})
     */
    ////Bot: Client,
    Bot: Client,
    /**
     * *  Custom Events Class
     * @example new CustomEvent(client (eg: bot))
     **/
    CustomEvent: CustomEvent,
    /**
     * * loadCommands
     * loads the commands of the provided file
     @example new LoadCommands(path,true/false)
     **/
    LoadCommands: LoadCommands,
    ClientShard: ClientShard,
    Voice: Voice,
    /**
     * * Lavalink
     * @example new addNode({
    url: "localhost:443",
    password: "password",
    name: "aoi.js",
    secure: false,
})
     **/
    Lavalink: Lavalink,
    // * AoiError Class
    AoiError: AoiError,
    // * Util Class
    Util,
};

/*Copyright © 2021 @Akarui Development*/
