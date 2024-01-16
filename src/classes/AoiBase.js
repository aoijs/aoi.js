const Discord = require("discord.js");
const { VariableManager } = require("./Variables.js");
const InteractionManager = require("./Interaction.js");
const LoadCommands = require("./LoadCommands.js");
const {
  ActivityTypeAvailables,
  IntentOptions,
  EventsToIntents,
  EventsToDjsEvents,
  EventstoFile,
} = require("../utils/Constants.js");
const Database = require("./Database.js");
const CacheManager = require("./CacheManager.js");
const { CommandManager } = require("./Commands.js");
const { Group } = require("@akarui/structures");
const AoiError = require("./AoiError.js");
const { functions: parser } = require("../core/AoiReader.js");

class BaseClient extends Discord.Client {
  constructor(options) {
    if (options.cache) {
      options.makeCache = CacheManager._setDjsCacheManagers(options.cache);
    }

    options.partials = options.partials || [
      Discord.Partials.GuildMember,
      Discord.Partials.Channel,
      Discord.Partials.Message,
      Discord.Partials.Reaction,
      Discord.Partials.User,
      Discord.Partials.GuildScheduledEvent,
      Discord.Partials.ThreadMember,
    ];

    const aoiOptions = {};
    Object.assign(aoiOptions, options);
    if (!options.intents) {
      throw new TypeError("Client intents must be provided.");
    }
    options.intents = options.intents.map((x) => IntentOptions[x] || x);
    super(options);
    this.aoiOptions = aoiOptions;

    this.cmd = new CommandManager(this);

    this.interactionManager = new InteractionManager(this);

    this.cacheManager = new CacheManager(this);

    this.variableManager = new VariableManager(this);

    if (
      options.disableAoiDB !== true &&
      (["default", "aoi.db"].includes(options?.database?.type) ||
        !options?.database)
    ) {
      const dbData = options?.database;

      this.db = new Database(
        dbData?.type
          ? dbData?.type === "default"
            ? "aoi.db"
            : dbData?.type
          : "aoi.db",
        dbData?.db ?? require("@akarui/aoi.db"),
        dbData?.dbType ?? "KeyValue",
        {
          dataConfig: {
            path: dbData?.path ?? "./database",
            tables: dbData?.tables?.length
              ? [...dbData?.tables, "__aoijs_vars__"]
              : ["main", "__aoijs_vars__"],
          },
          cacheConfig: {
            sortFunction: (a,b) => { return a.value - b.value }
          },
          encryptionConfig: {
            securityKey: dbData?.securityKey ?? "a-32-characters-long-string-here",
            encriptData: dbData?.encriptData ?? false,
          },
          ...dbData?.extraOptions,
        }
      );
    }

    if (
      Array.isArray(options?.disableFunctions) &&
      options?.disableFunctions.length
    ) {
      options?.disableFunctions.forEach((func) => {
        const index = parser.findIndex((f) => f === func);
        if (index !== -1) {
          parser.splice(index, 1);
        }
      });
    }

    this.prefix = options.prefix;
    this.#bindEvents();

    Object.defineProperty(this, "statuses", { value: new Group() });

    this.on("ready", async () => {
      await require("../handler/NonIntents/ready.js")(this);
      await require("../handler/status.js")(this.statuses, this);
      await require("../handler/AoiStart.js")(this);
    });
    this.login(options.token);
  }

  loadCommands(directory, debug = true) {
    const loader = new LoadCommands(this);
    loader.load(this.cmd, directory, debug);
  }

  status(...statuses) {
    for (const status of statuses) {
      status.type =
        Object.keys(ActivityTypeAvailables).includes(
          status.type.toLowerCase()
        ) || Object.values(ActivityTypeAvailables).includes(status.type)
          ? ActivityTypeAvailables[status.type.toLowerCase()]
          : ActivityTypeAvailables.playing;

      const option = {
        name: status.name,
        type: status.type,
        url: status.url,
      };

      this.statuses.set(this.statuses.size, {
        status: status.status || "online",
        time: isNaN(status.time) ? 12 : status.time,
        activity: option,
        afk: status.afk || false,
        shardID: status.shardId || 0,
      });
    }
  }

  /**
   * Adds variables to the variable manager.
   * @param {Object} d - The object containing the variables to be added.
   * @param {Object} [table=this.db?.tables?.[0]] - The table to which the variables belong.
   * @throws {TypeError} If a database is not provided.
   */
  variables(d, table = this.db?.tables?.[0]) {
    if (this.db === undefined) {
      throw new TypeError(
        "A database must be provided to use the variables method."
      );
    }

    for (const [name, value] of Object.entries(d)) {
      this.variableManager.add({ name, value, table });
    }
  }

  async _createCacheFactory(options) {
    options.makeCache = await CacheManager._setDjsCacheManagers(options.cache);
  }

  #bindEvents() {
    const bits = new Discord.IntentsBitField(this.options.intents);
    for (const event of this.aoiOptions.events ?? []) {
      let intent = EventsToIntents[event];
      const filedir = intent;
      const eventName = EventsToDjsEvents[event];
      const file = EventstoFile[event];
      if (intent === "GuildEmojis") intent = "GuildEmojisAndStickers";
      if (intent === "GuildMessageTypings") intent = "GuildMessageTyping";
      if (
        intent &&
        !["Custom", "NonIntents"].includes(intent) &&
        !bits.has(intent[0].toUpperCase() + intent.slice(1))
      ) {
        return AoiError.EventError(event, intent, 357);
      }

      try {
        const func = [
          "shardDisconnect",
          "shardError",
          "shardReconnecting",
          "shardResume",
        ].includes(event)
          ? require(`../shardhandler/${event}.js`)
          : Array.isArray(file)
            ? file.map((x) => require(`../handler/${filedir}/${x}.js`))
            : require(`../handler/${filedir}/${file}.js`);

        this.on(eventName, (...args) => {
          if (Array.isArray(func)) func.forEach((x) => x(...args, this));
          else func(...args, this);
        });
      } catch (error) {
        throw new TypeError(`Error loading "${event}" event, does not exist!`);
      }
    }
  }
}

module.exports = BaseClient;
