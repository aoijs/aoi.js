const {Collection,ShardingManager} = require('discord.js')
class ClientShard extends ShardingManager{
    constructor(file,options={}, client){
        super(file,options);
   this.client = client; 
      this.cmd = {
          shardDisconnect: new Collection(),
          shardError: new Collection()
          
      }
        this.client.clientShard = this 
        this.spawn()
    }
 onShardDisconnect(){
     this.client.on("shardDisconnect",async (event,id)=>{
await require('../ShardHandler/shardDisconnect.js')(event,id,this.client,this.cmd)
 })
    }
 onShardError(){
     this.client.on("shardError",async(error,shardID)=>{
  await require('../ShardHandler/shardError.js')(error,shardID,this.client,this.cmd)
         })
 }
}
module.exports = ClientShard;