const interpreter = require("../interpreter")

module.exports = async (client, channel, user) => {
    
    for (const command of client.typing_commands.array()) {
        
        const data = {
      author: user, 
      member: channel.type === "dm" ? undefined : await channel.guild.members.fetch(user.id).catch(err => undefined), 
      guild: channel.guild, 
      channel 
    }
    
    const id = command.channel ? command.channel.includes("$") ? await interpreter(client, data, [], {
      channel: command.channel,
      code: command.channel
    }, undefined, true) : command.channel : channel.id

    const ch = channel.guild.channels.cache.get(id)

    data.channel = command.channel ? ch ? ch : channel : channel 

    await interpreter(client, data, [], command, undefined) 
        
    }
}