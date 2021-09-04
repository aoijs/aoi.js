const Interpreter = require('../../interpreter.js')
const Util = require('../../classes/Util.js')
module.exports = async(message,client,db)=>{
    if (client.messageEventOptions) {

        const options = client. 

        messageEventOptions 

        if ((options.respondToBots === false && ( message.webhookID || message.author.bot)) ||(options.guildOnly && message.channel.type === Util.channelTypes.Dm))  return; 
        }
    //array of cmds 
 let cmds = client.cmd.default.allValues()
 //getting arrays of prefixes
 const prefixes = []
Array.isArray(client.prefix)?client.prefix.forEach(async x=>prefixes.push(x.includes("$")? await Interpreter(client,message,message.content.split(" "),{name:"PrefixParser",code:x},client.db,true) :x)):prefixes.push(client.prefix)
 //for loop of prefix array 
for(const prefix of prefixes){
    if(!message.content.toLowerCase().startsWith(prefix.toLowerCase())) continue;
    //getting message 
    const msg = message.content.slice(prefix.length).trim()
    //finding command 
  const cmd = cmds.filter(x=> msg.toLowerCase().startsWith( x.name.toLowerCase())  &&  msg.split(" ").slice(0, x.name.split(" ").length ).join(" ").toLowerCase()  ===  x.name.toLowerCase()  ||  ( Array.isArray(x.aliases) ? x.aliases.find(y=> msg.toLowerCase().startsWith( y.toLowerCase() )  &&  msg.split(" ").slice(0, y.split(" ").length ).join(" ").toLowerCase()  ===  y.toLowerCase() ): msg?.toLowerCase().startsWith( x.aliases?.toLowerCase() )  &&  msg.split(" ").slice(0, x.aliases?.split(" ").length ).join(" ")?.toLowerCase()  ===  x.aliases?.toLowerCase() ) )?.sort((a,b)=> a.name.length - b.name.length ).reverse()[0]
  console.log(cmd)
                       //args
  const args = msg.slice(cmd?.name.length||"").split(" ").slice(1)
  //chrck if blacklisted 
 const bl = client.blacklist 
 if(!bl.commands.includes(cmd.name?.toLowerCase())){
 if( !cmd.whitelist){
     if(bl.server.blacklist.has(message.guild.id)){
      if(bl.server.errorMsg){
          message.channel.send(bl.server.errorMsg) 
      }
      break;
  }
  else if(bl.channel.blacklist.has(message.channel.id)){
      if(bl.channel.errorMsg){
          message.channel.send(bl.channel.errorMsg) 
      }
      break;
   }
  else if(bl.role.blacklist.find(x=>message.member._roles.includes(x))){
      if(bl.role.errorMsg){
          message.channel.send(bl.role.errorMsg) 
      }
      break;
  }
  else if(bl.user.blacklist.has(`${message.author.id}_${message.guild.id}`)){
      if(bl.user.errorMsg){
          message.channel.send(bl.user.errorMsg) 
      }
      break;
  }
  else if(bl.globalUser.blacklist.has(message.author.id)){
      if(bl.globalUser.errorMsg){
          message.channel.send(bl.globalUser.errorMsg) 
      }
      break;
  }
}
 }
  //if command doesn't exist , then break the loop 
  if(!cmd) break; 
    if(cmd.dmOnly && message.channel.type === Util.channelTypes.Dm) break;
    //if cmd.async is true 
    if(cmd.async){
        await Interpreter(client,message,args,cmd,client.db)
    }
    //non async execution
    else{
        Interpreter(client,message,args,cmd,client.db)
    }
    
}
}
