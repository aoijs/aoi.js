const Interpreter = require("../../interpreter.js")
module.exports = async (client, message, db) => {
    if (client.messageEventOptions) {
        const options = client. 
        messageEventOptions 
        if ((options.respondToBots === false && ( message.webhookID || message.author.bot)) ||(options.guildOnly && message.channel.type === "dm"))  return; 
    }
    const commands = client.cmd.default.array().filter(c => c.name === "$alwaysExecute")
    if(!commands.length) return ;
    commands.map(async command => {
       await Interpreter(client, message, message.content.split(" "), command, db)
    }) 
}