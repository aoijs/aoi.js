const interpreter = require("../interpreter")

module.exports = async (client, oldp, newp) => {
    
    for (const command of client.presence_commands.array()) {
        
        const data = {
            author: newp.user, 
            guild: newp.guild
    }
    
    const id = await interpreter(client, data, [], {
      channel: command.channel,
      code: command.channel
    }, undefined, true)

    const channel = client.channels.cache.get(id)

    //if (!channel) return console.error(`channel with ID ${id} does not exist`)
    
    data.channel = channel

    await interpreter(client, data, [], command, undefined, undefined, undefined, {
        presence: oldp
    }) 
        
    }
}