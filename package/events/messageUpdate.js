const updateCommands = require("../handlers/updateCommands.js")

module.exports = async (client, old, msg, db) => {
    updateCommands(client, old, msg, db)
}