const interpreter = require("../interpreter")

module.exports = async (client, guild) => {
    
    for (const command of client.bot_leave_commands.array()) {
        
        const data = {
      author: guild.me.user, 
      member: guild.me, 
      guild: guild 
    }
    
    const id = await interpreter(client, data, [], {
      channel: command.channel,
      code: command.channel
    }, undefined, true)

    const channel = client.channels.cache.get(id)

    if (!channel) return console.error(`channel with ID ${id} does not exist`)
    
    data.channel = channel

    await interpreter(client, data, [], command, undefined) 
        
    }
}