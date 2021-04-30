module.exports = (client, oldp, newp) => {
    require("../handlers/presenceUpdateCommands") (client, oldp, newp)
}