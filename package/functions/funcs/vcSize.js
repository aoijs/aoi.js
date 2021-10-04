module.exports = async d =>{
    const code = d.command.code
    let inside = d.unpack()
    let err = d.inside(inside)
    if(err) return d.error(err)
    let [type,guildID = d.message.guild.id] = inside.splits 
    let res =0
    if(!["channels","users","songs"].includes(type)) return d.error(`:x: Invalid Type Provided In $vcSize${inside}`) 
    let c = d.client.voice.connections
        if(c.size ==0) return {
      code:  code.replaceLast(`$vcSize${inside}`,0)
        }
    if(guildID == "all"){
     let i ;
        switch(type){
     case "channels":
        res = c.size 
                break; 
     case "users" : 
      for(i=0;c.size >i;i++){
          res += c.array()[i].channel.members.size 
          }
         break; 
     case "songs" :
      for(i=0;c.size >i;i++){
          res +=d.client.servers.get(c.array()[i].channel.guild.id) ?d.client.servers.get(c.array()[i].channel.guild.id).songs.length : 0
          }
                break;
          }
           }
    else{
if(c.size == 0){res = 0}
        const guild = d.client.guilds.cache.get(guildID) 
        if(!guild) return d.error(`:x: Invalid guildID Provided in $vcSize${inside}`) 
      let oo =  c.filter(x=>x.channel.guild.id == guild.id) 
    if(oo.size == 0) { res = 0 }
else{
    switch (type) {
       case "channels" :
            res = oo.size 
            break;
       case "users" : 
//Ayaka#5057 #aoi.js #dbd.js
            res = oo.channel.members.size 
            break;
       case "songs" :
            res = d.client.servers.get(guild.id).songs.length 
            break ; 
            }
}
    }
    return {
      code:  code.replaceLast(`$vcSize${inside}`,res || 0)
        }
        } 
