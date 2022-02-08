const { ShardingManager } = require("discord.js");
const Collection = require("../cachehandler/index.js").cache;

class ClientShard extends ShardingManager {
  constructor(file, options = {}, spawnOptions) {
    super(file, options);
    this.file = file;
    this.spawnOptions = spawnOptions;
    this.cmd = {
      shardDisconnect: new Collection(),
      shardError: new Collection(),
      shardReady: new Collection(),
      shardReconnecting: new Collection(),
      shardResume: new Collection(),
    };
  }

  startProcess() {
    this.spawn(this.spawnOptions);
  }

  linkBot(client) {
    client.clientShard = this;
    this.client = client;
  }

  onShardDisconnect() {
    this.client.on("shardDisconnect", async (event, id) => {
      await require("../shardhandler/shardDisconnect.js")(
        event,
        id,
        this.client,
        this.cmd,
      );
    });
  }

  onShardError() {
    this.client.on("shardError", async (error, shardID) => {
      await require("../shardhandler/shardError.js")(
        error,
        shardID,
        this.client,
        this.cmd,
      );
    });
  }

  onShardReady() {
    this.client.on("shardReady", async (shardID, guilds) => {
      await require("../shardhandler/shardReady.js")(
        shardID,
        guilds,
        this.client,
        this.cmd,
      );
    });
  }

  onShardReconnecting() {
    this.client.on("shardReconnecting", async (shardID) => {
      await require("../shardhandler/shardReconnecting.js")(
        shardID,
        this.client,
        this.cmd,
      );
    });
  }

  onShardResume() {
    this.client.on("shardResume", async (shardID, events) => {
      await require("../shardhandler/shardError.js")(
        shardID,
        events,
        this.client,
        this.cmd,
      );
    });
  }
}

module.exports = ClientShard;
