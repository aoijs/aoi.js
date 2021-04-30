module.exports = async (client, channel, user) => {
    require("../handlers/typingStartCommands")(client, channel, user) 
}