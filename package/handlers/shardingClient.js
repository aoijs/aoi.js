const opt = require("../utils/options")

module.exports = options => {
  
    const { ShardingManager } = require('discord.js');
    const manager = new ShardingManager(__dirname + "/clientShard.js", { token: opt.token });

    manager.on('shardCreate', shard => console.log(`Launched Shard ${shard.id}`));
    manager.spawn();
}