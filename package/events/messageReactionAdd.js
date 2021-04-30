const reactionRoleAdd = require("../handlers/reactionRoleAdd")
const reactionAddCommands = require("../handlers/reactionAddCommands")

module.exports = (client, reaction, user, db) => {
    reactionRoleAdd(client, reaction, user, db)

    reactionAddCommands(client, reaction, user)
}