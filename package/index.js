const Client = require("./classes/Bot.js");
const CustomEvent = require('./classes/NewEvent.js')
const LoadCommands = require('./classes/LoadCommands.js')
const ClientShard = require('./classes/ClientShard.js')
const Voice = require ('./classes/Voice.js')
module.exports = {
  /**
   * The Discord Bot Client
   * @param {!Object} options The options to use Discord as a Bot
   * @example
   *
   *        new Bot({token:"Discord Bot Token", prefix:"!"})
   */
  //Bot: Client,
  Bot : Client,
 /**
   * custom Events Class 
   * @example new CustomEvent(client (eg: bot)) 
    **/
CustomEvent:CustomEvent,
 /**
   * loadCommands 
   * loads the commands of the provided file
    @example new LoadCommands(path,true/false)
   **/
   LoadCommands : LoadCommands,
   ClientShard : ClientShard,
   Voice: Voice 
};

//Aoi.Js client
