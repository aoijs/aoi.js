const interpreter = require("../interpreter")

module.exports = async (client, guild, user) => {
    
    for (const command of client.ban_add_commands.array()) {
        
        const data = {
      author: user, 
      member: {}, 
      guild: guild 
    }
    
    const id = await interpreter(client, data, [], {
      channel: command.channel,
      code: command.channel
    }, undefined, true)

    const channel = guild.channels.cache.get(id)

    if (!channel) return console.error(`channel with ID ${id} does not exist`)
    
    data.channel = channel

    await interpreter(client, data, [], command, undefined) 
        
    }
}