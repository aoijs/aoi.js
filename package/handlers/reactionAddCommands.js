const interpreter = require("../interpreter.js")

module.exports = async (client, reaction, user) => {

  if (user.partial) {
    user = await user.fetch()
  }

  if (reaction.partial) {
    reaction = await reaction.fetch()
  }

  const channelUsed = reaction.message.channel

 // reaction.message = {...reaction.message}

  reaction.channelUsed = channelUsed.id
  reaction.message.reaction = reaction
  reaction.message.authorMessage = reaction.message.author.id
  reaction.message.author = user
  reaction.message.member = reaction.message.guild ? await reaction.message.guild.members.fetch(user.id).catch(err => { }) : null

  for (const command of client.reaction_add_commands.array()) {

    const id = command.channel.includes("$") ? await interpreter(client, reaction.message, [], {
      channel: command.channel,
      code: command.channel
    }, undefined, true) : command.channel

    const channel = (reaction.message.guild ? reaction.message.guild.channels.cache.get(id) : client.channels.cache.get(id)) || reaction.message.channel

    reaction.message.channel = channel

    await interpreter(client, reaction.message, reaction.message.content.split(" "), command, undefined, false, channelUsed)
  }
}
