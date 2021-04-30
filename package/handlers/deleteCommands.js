const interpreter = require("../interpreter.js")

module.exports = async (client, msg, db) => {
  msg = Object.assign(Object.create(msg), msg) 
  
  if (!msg.partial) {
    if (msg.author.id === client.user.id) return
  }

  for (const command of client.deleted_commands.array()) {
    
    const id = await interpreter(client, msg, [], {
      channel: command.channel,
      code: command.channel
    }, db, true)

    const channel = msg.guild.channels.cache.get(id)

   // if (!channel) return console.error(`channel with ID ${id} does not exist`)

    const channelUsed = msg.channel.id
    
    msg.channel = channel

    await interpreter(client, msg, msg.content ? msg.content.split(" ") : [], command, db, false, channelUsed) 
  } 
    
} 