const banRemoveCommands = require("../handlers/banRemoveCommands") 

module.exports = (client, guild, user) => {
    banRemoveCommands(client, guild, user)
}
