const interpreter = require("../interpreter.js")

module.exports = async (client, omsg, nmsg, db) => {
    nmsg = Object.assign(Object.create(nmsg), nmsg) 
    omsg = Object.assign(Object.create(omsg), omsg) 
    
  let user = omsg.author || nmsg.author 

  if (!user) {
      nmsg = await nmsg.fetch().catch(err => null) 
      if (!nmsg) return 
      else client.channels.cache.get(nmsg.channel.id).messages.cache.set(nmsg.id, nmsg) 
      user = nmsg.author 
  }
  
  if (user.partial) await user.fetch()
  
  if (user.bot) return 

  nmsg.author = user
  
  for (const command of client.update_commands.array()) {
    
    const id = await interpreter(client, nmsg, [], {
      channel: command.channel,
      code: command.channel
    }, db, true)

    const channel = nmsg.guild ? nmsg.guild.channels.cache.get(id) : client.channels.cache.get(id) 

    //if (!channel) return console.error(`channel with ID ${id} does not exist`)

    const channelUsed = nmsg.channel.id

    nmsg.channel = channel

    await interpreter(client, nmsg, nmsg.content.split(" "), command, db, false, channelUsed, {
        oldMessage: omsg && omsg.content ? omsg.content.deleteBrackets() : "" 
    }) 
  } 
    
} 