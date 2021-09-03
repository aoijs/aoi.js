const interpreter = require("../interpreter")

module.exports = async (client, channel) => {
    
    for (const command of client.channel_create_commands.array()) {
        
        const data = {
            guild: channel.guild,
            channel: channel 
    }
    
    const id = await interpreter(client, data, [], {
      channel: command.channel,
      code: command.channel
    }, undefined, true)

    const ch = client.channels.cache.get(id)

    //if (!channel) return console.error(`channel with ID ${id} does not exist`)
    
    data.channel = ch || data.channel

    await interpreter(client, data, [], command, undefined, undefined, undefined, {
        old_channel: channel, 
        new_channel: channel, 
    }) 
        
    }
}