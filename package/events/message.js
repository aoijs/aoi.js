const Command_Handler = require("../handlers/commands.js");
const alwaysExecuteCommands = require("../handlers/alwaysExecuteCommands");

const Message = async (client, message, db) => {
  await Command_Handler(client, message, db);

  alwaysExecuteCommands(client, message, db);

  require("../handlers/typingStopHandling")(client, message);
};

module.exports = Message;
