const interpreter = require("../interpreter.js")

module.exports = async (client, member, db) => {
  
  for (const command of client.leave_commands.array()) {
    
    const data = {
      author: member.user,
      member: member,
      guild: member.guild
    }
    
    const id = await interpreter(client, data, [], {
      channel: command.channel,
      code: command.channel
    }, db, true)

    const channel = member.guild.channels.cache.get(id)

    //if (!channel) return console.error(`channel with ID ${id} does not exist`)
    
    data.channel = channel

    await interpreter(client, data, [], command, db) 
  } 
    
} 