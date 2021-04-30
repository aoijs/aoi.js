const interpreter = require("../interpreter.js")

module.exports = async (client) => {

  for (const command of client.ready_commands.array()) {

    const data = {}
    
    const id = await interpreter(client, data, [], {
      channel: command.channel,
      code: command.channel
    }, undefined, true)

    const channel = client.channels.cache.get(id)

   // if (!channel) return console.error(`channel with ID ${id} does not exist`)

    data.channel = channel

    await interpreter(client, data, [], command, undefined)
  }

} 