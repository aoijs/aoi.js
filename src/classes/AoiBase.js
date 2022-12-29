const Discord = require("discord.js");
const fs = require("fs");
const { VariableManager } = require("./Variables.js");
const InteractionManager = require("./Interaction.js");
const {
  ActivityTypeAvailables,
  IntentOptions,
  IntentOptionAll
} = require("../utils/Constants.js");
const {
  AoijsAPI,
  DbdTsDb,
  AoiMongoDb,
  CustomDb,
  Promisify
} = require("./Database.js");
const CacheManager = require("./CacheManager.js");
const { CommandManager } = require("./Commands.js");
const { Group } = require("./structures/dist");

class BaseClient extends Discord.Client {
  constructor(options) {
    if (options.cache) {
      options.makeCache = CacheManager._setDjsCacheManagers(
        options.cache
      );
    }

    if (options.presence?.activities?.length) {
      if (
        Object.keys(ActivityTypeAvailables).includes(
          options.presence?.activities[0].type
        ) ||
        Object.values(ActivityTypeAvailables).includes(
          options.presence?.activities[0].type
        )
      ) {
        options.presence.activities[0].type =
          ActivityTypeAvailables[
            options.presence?.activities[0].type
            ] || options.presence?.activities[0].type;
      } else {
        throw new TypeError(
          `Activity Type Error: Invalid Activity Type (${options.presence?.activities[0].type}) Provided`
        );
      }
    }

    options.partials = options.partials || [
      "CHANNEL",
      "GUILD_MEMBER",
      "MESSAGE",
      "USER",
      "REACTION"
    ];

    const aoiOptions = {};
    Object.assign(aoiOptions, options);
    options.intents = options.intents.map(x => IntentOptions[x] || x);
    super(options);
    this.aoiOptions = aoiOptions;
    this.plugins = {
      functions: []
    };
    this.cmd = new CommandManager(this);

    this.interactionManager = new InteractionManager(this);

    this.cacheManager = new CacheManager(this);

    this.variableManager = new VariableManager(this);

    if (options.autoUpdate) {
      require("../handler/AoiAutoUpdate.js")();
    }
    if (options.plugins) {
      if (Array.isArray(options.plugins)) {
        for (const plugin of options.plugins) {
          if (typeof plugin === "string") {
            if (fs.fstatSync(plugin).isDirectory()) {
              const pluginPaths = fs.readdirSync(plugin);
              for (const pluginPath of pluginPaths) {
                const pluginPaths = fs.readdirSync(
                  options.plugins
                );
                for (const pluginPath of pluginPaths) {
                  const pluginModule = require(`${process.cwd()}/${
                    options.plugins
                  }/${pluginPath}`);
                  if (pluginModule?.init) {
                    pluginModule.init(this);
                  }

                  if (pluginModule?.commands) {
                    this.cmd.add(pluginModule.commands);
                  }

                  if (pluginModule?.functions) {
                    this.functionManager.createFunction(
                      ...pluginModule.functions
                    );
                    this.plugins.functions.push(
                      ...pluginModule.functions
                    );
                  }
                }
              }
            } else {
              const pluginPath = require.resolve(plugin, {
                paths: [process.cwd()]
              });
              const pluginModule = require(pluginPath);
              if (pluginModule?.init) {
                pluginModule.init(this);
              }

              if (pluginModule?.commands) {
                this.cmd.add(pluginModule.commands);
              }

              if (pluginModule?.functions) {
                this.functionManager.createFunction(
                  ...pluginModule.functions
                );
                this.plugins.functions.push(
                  ...pluginModule.functions
                );
              }
            }
          } else {
            throw new TypeError("Plugin must be a string");
          }
        }
      } else if (typeof options.plugins === "string") {
        if (fs.statSync(options.plugins).isDirectory()) {
          const pluginPaths = fs.readdirSync(options.plugins);
          for (const pluginPath of pluginPaths) {
            const pluginModule = require(`${process.cwd()}/${
              options.plugins
            }/${pluginPath}`);
            if (pluginModule?.init) {
              pluginModule.init(this);
            }

            if (pluginModule?.commands) {
              this.cmd.add(pluginModule.commands);
            }

            if (pluginModule?.functions) {
              this.functionManager.createFunction(
                ...pluginModule.functions
              );
              this.plugins.functions.push(
                ...pluginModule.functions
              );
            }
          }
        } else {
          const pluginPath = require.resolve(options.plugins, {
            paths: [process.cwd()]
          });
          const pluginModule = require(pluginPath);
          if (pluginModule?.init) {
            pluginModule.init(this);
          }

          if (pluginModule?.commands) {
            this.cmd.add(pluginModule.commands);
          }

          if (pluginModule?.functions) {
            this.functionManager.createFunction(
              ...pluginModule.functions
            );
            this.plugins.functions.push(...pluginModule.functions);
          }
        }
      } else {
        throw new TypeError("Plugin must be a string");
      }
    }
    if (
      [
        "default",
        "dbdjs.db",
        "dbdjs.db-sql",
        "dbdjs.mongo",
        "aoi.fb",
        "aoi.db"
      ].includes(options?.database?.type)
    ) {
      this.db = new AoijsAPI(
        options?.database?.db,
        {
          path: options?.database?.path || "./database/",
          tables: options?.database?.tables || ["main"]
        },
        {
          type: options?.database?.type || "default",
          promisify: options?.database?.promisify || false
        },
        options.database?.extraOptions || {}
      );
    } else if (options?.database?.type === "dbdts.db") {
      this.db = new DbdTsDb(
        options.database?.db,
        {
          path: options.database?.path || "./database",
          tables: options?.database?.tables || ["main"]
        },
        { type: "dbdts.db", promisify: false },
        options.database?.extraOptions || {}
      );
    } else if (options?.database?.type === "aoi.mongo") {
      this.db = new AoiMongoDb(
        options.database?.db,
        {
          path: options.database?.path,
          tables: options.database?.tables || ["main"]
        },
        { type: "aoi.mongo", promisify: true },
        {
          ...AoiMongoDb.defaultOptions,
          ...(options.database?.extraOptions || {})
        }
      );
    } else if (
      options?.database?.type === "custom" &&
      !options?.database?.promisify
    ) {
      this.db = new CustomDb(
        options?.database?.db,
        {
          path: options.database?.path || "./database",
          tables: options?.database?.tables || ["main"]
        },
        { type: "custom", promisify: true },
        options.database?.extraOptions || {}
      );
    } else if (
      options?.database?.type === "custom" &&
      options?.database?.promisify
    ) {
      this.db = new Promisify(
        options.database?.db,
        {
          path: options.database?.path || "./database",
          tables: options?.database?.tables || ["main"]
        },
        { type: "custom", promisify: true },
        options.database?.extraOptions || {}
      );
    } else {
      this.db = new AoijsAPI(
        options?.database?.db || require("dbdjs.db"),
        {
          path: options?.database?.path || "./database/",
          tables: options?.database?.tables || ["main"]
        },
        {
          type: options?.database?.type || "default",
          promisify: options?.database?.promisify || false
        },
        options.database?.extraOptions || {}
      );
    }

    if (options?.events?.functionError) {
      this.on("functionError", async (data, client) => {
        await require("../handler/custom/functionError.js")(
          data,
          client
        );
      });
    }

    this.prefix = options.prefix;

    Object.defineProperty(this, "statuses", { value: new Group() });

    if (options.mobilePlatform === true) {
      this.options.ws.properties.browser = "Discord Android";
    }

    this.on("ready", async () => {
      require("../handler/status.js")(this.statuses, this);
      await require("../handler/startup.js")(this);
      await require("../handler/nonIntents/ready.js")(this);
    });
    this.login(options.token);
  }

  /**
   * @param  {object[]} statuses
   */
  status(...statuses) {
    for (const status of statuses) {
      status.type =
        (Object.keys(ActivityTypeAvailables).includes(status.type) ||
          Object.values(ActivityTypeAvailables).includes(status.type))
          ? (ActivityTypeAvailables[status.type])
          : ActivityTypeAvailables.PLAYING;
      const option = {
        name: status.text,
        type: status.type,
        url: status.url
      };

      this.statuses.set(this.statuses.size, {
        status: status.status || "online",
        time: isNaN(status.time || 12) ? 12 : status.time,
        activity: option,
        afk: status.afk || false,
        shardID: status.shardIDs || 0
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
    options.makeCache = await CacheManager._setDjsCacheManagers(
      options.cache
    );
  }
}

module.exports = BaseClient;
