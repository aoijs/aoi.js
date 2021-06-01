module.exports = (client, messages) => {
  require("../handlers/messageDeleteBulkCommands")(client, messages);
};
