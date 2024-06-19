const { ShardingManager } = require("discord.js");
const { Group : Collection } = require( "@aoijs/aoi.structures" );

class ClientShard extends ShardingManager {
  constructor(file, options = {}, spawnOptions) {
    super(file, options);
    this.file = file;
    this.spawnOptions = spawnOptions;
    this.cmd = {
      shardCreate: new Collection(),
    };
  }

  shardCreateCommand(d) {
    this.cmd.shardCreate.set(this.cmd.shardCreate.size, d);
  }
  startProcess() {
    this.spawn(this.spawnOptions);
  }

  onShardCreate() {
    this.on("shardCreate", async (shard) =>
      require("../sharding/shardCreate.js")(shard, this.cmd),
    );
  }
}
module.exports = ClientShard;