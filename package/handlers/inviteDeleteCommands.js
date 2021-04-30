const interpreter = require("../interpreter")

module.exports = async (client, invite) => {
    
    for (const command of client.invite_delete_commands.array()) {
        
        const data = {
      author: invite.inviter,
      channel: invite.channel, 
      member: {}, 
      guild: invite.guild
    }
    
    const id = await interpreter(client, data, [], {
      channel: command.channel,
      code: command.channel
    }, undefined, true)

    const channel = invite.guild.channels.cache.get(id)

    if (!channel) return console.error(`channel with ID ${id} does not exist`)
    
    data.channel = channel

    await interpreter(client, data, [], command, undefined, undefined, undefined, {
        invite: invite 
    }) 
        
    }
}