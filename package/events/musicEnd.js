const musicEndCommands = require("../handlers/musicEndCommands.js")
//Command
module.exports = async (client, server, old) => {
  //Run Event
  musicEndCommands(client, server, old)
  
}