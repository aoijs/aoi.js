const { ShardingManager } = require('discord.js')
const Collection = require('../CacheHandler/index.js').cache
class ClientShard extends ShardingManager {
   constructor(file, options = {}, client) {
      super(file, options);
      this.client = client;
      this.file = file
      this.cmd = {
         shardDisconnect: new Collection(),
         shardError: new Collection(),
         shardReady: new Collection(),
         shardReconnecting: new Collection(),
         shardResume: new Collection()
      }
      this.client.clientShard = this
      this.spawn()
   }
   onShardDisconnect() {
      this.client.on("shardDisconnect", async (event, id) => {
         await require('../ShardHandler/shardDisconnect.js')(event, id, this.client, this.cmd)
      })
   }
   onShardError() {
      this.client.on("shardError", async (error, shardID) => {
         await require('../ShardHandler/shardError.js')(error, shardID, this.client, this.cmd)
      })
   }
   onShardReady() {
      this.client.on("shardReady", async (shardID, guilds) => {
         await require('../ShardHandler/shardReady.js')(shardID, guilds, this.client, this.cmd)
      })
   }
   onShardReconnecting() {
      this.client.on("shardReconnecting", async (shardID) => {
         await require('../ShardHandler/shardReconnecting.js')(shardID, this.client, this.cmd)
      })
   }
   onShardResume() {
      this.client.on("shardResume", async (shardID, events) => {
         await require('../ShardHandler/shardError.js')(shardID, events, this.client, this.cmd)
      })
   }
}
module.exports = ClientShard;