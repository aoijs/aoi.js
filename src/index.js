const Client = require("./classes/AoiClient");
const CustomEvent = require("./classes/NewEvent.js");
const LoadCommands = require("./classes/LoadCommands.js");
const ClientShard = require("./classes/ClientShard.js");
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
  AoiClient: Client,
  /**
   * *  Custom Events Class
   * @example new CustomEvent(client (eg: bot))
   **/
  CustomEvent,
  /**
     * * loadCommands
     * loads the commands of the provided file
     @example new LoadCommands(path,true/false)
     **/
  LoadCommands,
  ClientShard,
  // * AoiError Class
  AoiError,
  // * Util Class
  Util,
};

/*Copyright © 2021 @Akarui Development*/
