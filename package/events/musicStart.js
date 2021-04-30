const musicStartCommands = require("../handlers/musicStartCommands") 
//event

module.exports = async (client, server, old) => {
    //handles client
  
    musicStartCommands(client, server, old)
}