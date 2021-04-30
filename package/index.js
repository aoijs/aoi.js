const Client = require("./classes/bot.js");

module.exports = {
  /**
   * The Discord Bot Client
   * @param {!Object} options The options to use Discord as a Bot
   * @example
   *
   *        new Bot({token:"Discord Bot Token", prefix:"!"})
   */
  Bot: Client,
};

//DBD.JS client
