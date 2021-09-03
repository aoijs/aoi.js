const Command_Handler = require("../Handler/commands.js");
const alwaysExecuteCommands = require("../Handler/alwaysExecute");



const Message = async (client, message, db) => {
  await Command_Handler(client, message, db);

 await alwaysExecuteCommands(client, message, db);

  require("../handlers/typingStopHandling")(client, message);
};

module.exports = Message;
