const deletedCommands = require("../handlers/deleteCommands")

module.exports = (client, message, db) => {
    deletedCommands(client, message, db)
}