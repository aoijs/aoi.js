const reactionRoleRemove = require("../handlers/reactionRoleRemove")
const reactionRemoveCommands = require("../handlers/reactionRemoveCommands")

module.exports = (client, reaction, user, db) => {
    reactionRoleRemove(client, reaction, user, db)
//DBD.JS :)
    reactionRemoveCommands(client, reaction, user)
}