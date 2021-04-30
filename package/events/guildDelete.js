const botLeaveCommands = require("../handlers/botLeaveCommands")

module.exports = async (client, guild) => {
  if (client.invites) client.invites.delete(guild.id)

  botLeaveCommands(client, guild)
}