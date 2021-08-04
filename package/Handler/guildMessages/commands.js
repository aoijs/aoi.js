const Interpreter = require('../../interpreter.js')
module.exports = async(message,client,db)=>{
 let cmds = client.cmd.default.array()
 const prefixes = Array.isArray(client.prefix)?client.prefix.map(async x=>x.includes("$")? await Interpreter(client,message,message.content.split(" "),{name:"PrefixParser",code:x},client.db,true) :x):[client.prefix]
for(const prefix of prefixes){
    if(!message.content.toLowerCase().startsWith(prefix.toLowerCase())) continue;
    const msg = message.content.slice(prefix.length).trim()
  const cmd = cmds.filter(x=>msg.toLowerCase().startsWith(x.name.toLowerCase()) && msg.split(" ").slice(0,x.name.split(" ").length).join(" ").toLowerCase() ===x.name.toLowerCase()).sort((a,b)=>a.name.length - b.name.length).reverse()[0]
  const args = msg.slice(cmd?.name.length||"").split(" ")
  if(!cmd) break;
    if(cmd.async){
        await Interpreter(client,message,args,cmd,client.db)
    }
    else{
        Interpreter(client,message,args,cmd,client.db)
    }
}
 
}