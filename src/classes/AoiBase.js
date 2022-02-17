const Discord = require("discord.js");
const dbddb = require("dbdjs.db");

const { VariableManager } = require("./Variables.js");
const Blacklist = require("./Blacklist.js");
const Group = require("../cachehandler/index.js").cache;
const InteractionManager = require("./Interaction.js");
const {
  ActivityTypeAvailables,
  IntentOptions,
  SlashOptionTypes,
} = require("../utils/Constants.js");
const {
  AoijsAPI,
  DbdTsDb,
  AoiMongoDb,
  CustomDb,
  Promisify,
} = require("./Database.js");
const CacheManager = require("./CacheManager.js");
const { CommandManager } = require("./Commands.js");

class BaseClient extends Discord.Client {
  constructor(options) {
    if (options.cache) {
      options.makeCache = CacheManager._setDjsCacheManagers(options.cache);
    }

    if (options.presence?.activities?.length) {
      if (
        Object.keys(ActivityTypeAvailables).includes(
          options.presence?.activities[0].type,
        ) ||
        Object.values(ActivityTypeAvailables).includes(
          options.presence?.activities[0].type,
        )
      ) {
        options.presence.activities[0].type =
          ActivityTypeAvailables[options.presence?.activities[0].type] ||
          options.presence?.activities[0].type;
      } else {
        throw new TypeError(
          `ActivityTypeAvailableError: Invalid Activity Type (${options.presence?.activities[0].type}) Provided`,
        );
      }
    }

    options.partials = options.partials || [
      "CHANNEL",
      "GUILD_MEMBER",
      "MESSAGE",
      "USER",
      "REACTION",
    ];

    options.intents = !Array.isArray(options.intents)
      ? options.intents?.toLowerCase() === "all"
        ? IntentOptions.all
        : undefined
      : options.intents.map((x) => IntentOptions[x] || x);

    const aoiOptions = Object.assign({}, options);

    super(options);
    this.aoiOptions = aoiOptions;

    this.cmd = new CommandManager(this);

    this.interactionManager = new InteractionManager(this);

    this.blacklist = new Blacklist(this);

    this.cacheManager = new CacheManager(this);

    this.variableManager = new VariableManager(this);

    if (options.autoUpdate) {
      require("../handler/AoiAutoUpdate.js")();
    }

    if (
      ["default", "dbdjs.db", "dbdjs.db-sql", "dbdjs.mongo", "aoi.fb"].includes(
        options?.database?.type,
      )
    ) {
      this.db = new AoijsAPI(
        options?.database?.db || dbddb,
        {
          path: options?.database?.path || "./database/",
          tables: options?.database?.tables || ["main"],
        },
        {
          type: options?.database?.type || "default",
          promisify: options?.database?.promisify || false,
        },
        options.database?.extraOptions || {},
      );
    } else if (options?.database?.type === "dbdts.db") {
      this.db = new DbdTsDb(
        options.database?.db,
        {
          path: options.database?.path || "./database",
          tables: options?.database?.tables || ["main"],
        },
        { type: "dbdts.db", promisify: false },
        options.database?.extraOptions || {},
      );
    } else if (options?.database?.type === "aoi.mongo") {
      this.db = new AoiMongoDb(
        options.database?.db,
        {
          path: options.database?.path,
          tables: options.database?.tables || ["main"],
        },
        { type: "aoi.mongo", promisify: true },
        {
          ...AoiMongoDb.defaultOptions,
          ...(options.database?.extraOptions || {}),
        },
      );
    } else if (
      options?.database?.type === "custom" &&
      !options?.database?.promisify
    ) {
      this.db = new CustomDb(
        options?.database?.db,
        {
          path: options.database?.path || "./database",
          tables: options?.database?.tables || ["main"],
        },
        { type: "custom", promisify: true },
        options.database?.extraOptions || {},
      );
    } else if (
      options?.database?.type === "custom" &&
      options?.database?.promisify
    ) {
      this.db = new Promisify(
        options.database?.db,
        {
          path: options.database?.path || "./database",
          tables: options?.database?.tables || ["main"],
        },
        { type: "custom", promisify: true },
        options.database?.extraOptions || {},
      );
    } else {
      this.db = new AoijsAPI(
        options?.database?.db || dbddb,
        {
          path: options?.database?.path || "./database/",
          tables: options?.database?.tables || ["main"],
        },
        {
          type: options?.database?.type || "default",
          promisify: options?.database?.promisify || false,
        },
        options.database?.extraOptions || {},
      );
    }

    if (options?.events?.functionError) {
      this.on("functionError", async (data, client) => {
        await require("../handler/custom/functionError.js")(data, client);
      });
    }

    this.prefix = options.prefix;

    Object.defineProperty(this, "statuses", { value: new Group() });

    if (options.mobilePlatform === true) {
      this.options.ws.properties.$browser = "Discord Android";
    }
    this.on("ready", async () => {
      require("../handler/status.js")(this.statuses, this);
      await require("../handler/startup.js")(this);
      if (options?.fetchInvites?.enabled) {
        require("../handler/fetchInvites.js")(this);
      }
      await require("../handler/nonIntents/ready.js")(this);
    });
    this._api = (url) =>
      `https://discord.com/api/v9/${url.startsWith("/") ? url.slice(1) : url}`;
    this.login(options.token);
  }

  /**
   * @param  {object[]} statuses
   */
  status(...statuses) {
    for (const status of statuses) {
      status.type =
        Object.keys(ActivityTypeAvailables).includes(status.type) ||
        Object.values(ActivityTypeAvailables).includes(status.type)
          ? ActivityTypeAvailables[status.type] || status.type
          : "PLAYING";
      const option = { name: status.text, type: status.type, url: status.url };

      this.statuses.set(this.statuses.size, {
        status: status.status || "online",
        time: isNaN(status.time || 12) ? 12 : status.time,
        activity: option,
        afk: status.afk || false,
        shardID: status.shardIDs || 0,
      });
    }
  }

  /**
   * @param  {Record<string,string | number | object >} d
   * @param  {string} table=this.db.tables[0]
   */
  variables(d, table = this.db.tables[0]) {
    for (const [name, value] of Object.entries(d)) {
      this.variableManager.add({ name, value, table });
    }
    if (this.db instanceof DbdTsDb) {
      const data = this.variableManager.cache
        .allValues()
        .map((x) => x.object());

      this.db.addColumns(table, data);
    }
  }

  async _createCacheFactory(options) {
    options.makeCache = await CacheManager._setDjsCacheManagers(options.cache);
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
    this.on("shardError", async (error, shardID) => {
      await require("../shardhandler/shardError.js")(
        error,
        shardID,
        this.client,
        this.cmd,
      );
    });
  }

  onShardReady() {
    this.on("shardReady", async (shardID, guilds) => {
      await require("../shardhandler/shardReady.js")(
        shardID,
        guilds,
        this.client,
        this.cmd,
      );
    });
  }

  onShardReconnecting() {
    this.on("shardReconnecting", async (shardID) => {
      await require("../shardhandler/shardReconnecting.js")(
        shardID,
        this.client,
        this.cmd,
      );
    });
  }

  onShardResume() {
    this.on("shardResume", async (shardID, events) => {
      await require("../shardhandler/shardError.js")(
        shardID,
        events,
        this.client,
        this.cmd,
      );
    });
  }
}

module.exports = BaseClient;
