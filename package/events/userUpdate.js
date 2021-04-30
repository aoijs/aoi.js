module.exports = (client, oldU, newU) => {
    require("../handlers/userUpdateCommands")(client, oldU, newU) 
}