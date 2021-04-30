module.exports = (client, oldm, newm) => {
    require("../handlers/guildMemberUpdateCommands")(client, oldm, newm) 
}