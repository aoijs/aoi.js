const Interpreter = require("../../interpreter.js")
module.exports = async (client, message, db) => {
    if (client.messageEventOptions) {
        const options = client. 
        messageEventOptions 
        if ((options.respondToBots === false && ( message.webhookID || message.author.bot)) ||(options.guildOnly && message.channel.type === "dm"))  return; 
    }
    const commands = client.cmd.default.array().filter(c => c.nonPrefixed)
    if(!commands.length) return ;
    for(const cmd of commands){
        if(cmd.name.includes("$")){
           cmd.name = await Interpreter(client, message,message.content.split(" "),{name:"NameParser",code:cmd.name},client.db,true)
        }
        if(! message.content.toLowerCase().startsWith(cmd.name.toLowerCase()) || !(Array.isArray(cmd.aliases)?cmd.aliases.find(x=>message.content.toLowerCase().startsWith(x.toLowerCase())) : message.content.toLowerCase().startsWith(cmd.aliases))) continue;
      await Interpreter(client, message, message.content.split(" "), cmd,client.db)
    }
    
}