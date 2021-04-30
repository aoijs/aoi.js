const interpreter = require("../interpreter.js")

module.exports = async (client, reaction, user) => {

    if (user.partial) {
        user = await user.fetch()
    }

    if (reaction.partial) {
        reaction = await reaction.fetch()
    }
    
    reaction = Object.assign(Object.create(reaction), reaction)

    for (const command of client.reaction_add_commands.array()) {
    
        const id = await interpreter(client, reaction.message, [], {
          channel: command.channel,
          code: command.channel
        }, undefined, true)
    
        const channel = (reaction.message.guild ? reaction.message.guild.channels.cache.get(id) : client.channels.cache.get(id)) || reaction.message.channel

        const channelUsed = reaction.message.channel.id

        reaction.message.channel = channel
        reaction.message.reaction = reaction
        reaction.message.authorMessage = reaction.message.author.id
        reaction.message.author = user
        reaction.message.member = reaction.message.guild ? await reaction.message.guild.members.fetch(user.id).catch(err => {}) : null 

        await interpreter(client, reaction.message, reaction.message.content.split(" "), command, undefined, false, channelUsed) 

        reaction.message.channel.messages.cache.delete(reaction.message.id)
      } 
}