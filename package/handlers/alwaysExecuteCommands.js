const interpreter = require("../interpreter.js")

module.exports = (client, message, db) => {
    
    if (client.messageEventOptions) {
        const options = client. 
        messageEventOptions 
        
        if (options.respondToBots === false && message.webhookID)  return 
        
        if (options.respondToBots === false && message.author.bot) return 
        
        if (options.guildOnly && message.channel.type === "dm") return 
    }
    const commands = client.bot_commands.array().filter(c => c.name === "$alwaysExecute")

    commands.map(command => {
        interpreter(client, message, message.content.split(" "), command, db)
    }) 
}


