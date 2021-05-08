module.exports = (client, oldg, newg) => {
  require("../handlers/guildUpdateCommands")(client, oldg, newg);
};