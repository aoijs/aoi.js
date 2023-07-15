const Discord = require("discord.js");
const { VariableManager } = require("./Variables.js");
const InteractionManager = require("./Interaction.js");
const fs = require("fs");;
const path = require("path");
const {
    ActivityTypeAvailables,
    IntentOptions,
    EventsToIntents,
    EventsToDjsEvents,
    EventstoFile,
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
const { Group } = require("@akarui/structures");
const AoiError = require("./AoiError.js");
const { functions: parser } = require("../core/AoiReader.js");

class BaseClient extends Discord.Client {
    constructor(options) {
        if (options.cache) {
            options.makeCache = CacheManager._setDjsCacheManagers(
                options.cache,
            );
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
                    ActivityTypeAvailables[
                        options.presence?.activities[0].type
                        ] || options.presence?.activities[0].type;
            } else {
                throw new TypeError(
                    `Activity Type Error: Invalid Activity Type (${options.presence?.activities[0].type}) Provided`,
                );
            }
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
        options.intents = options.intents.map((x) => IntentOptions[x] || x);
        super(options);
        this.aoiOptions = aoiOptions;

        this.cmd = new CommandManager(this);

        this.interactionManager = new InteractionManager(this);

        this.cacheManager = new CacheManager(this);

        this.variableManager = new VariableManager(this);

        if (
            [
                "default",
                "dbdjs.db",
                "dbdjs.db-sql",
                "dbdjs.mongo",
                "aoi.fb",
                "aoi.db",
            ].includes(options?.database?.type)
        ) {
            this.db = new AoijsAPI(
                options?.database?.db,
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
                options?.database?.db || require("@akarui/aoi.db"),
                {
                    path: options?.database?.path || "./database/",
                    tables: options?.database?.tables || ["main"],
                },
                {
                    type: options?.database?.type || "default",
                    promisify: options?.database?.promisify || false,
                },
                options?.database?.extraOptions || {},
            );
        }

        if (Array.isArray(options?.disableFunctions) && options?.disableFunctions.length) {
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
            require("../handler/status.js")(this.statuses, this);
            await require("../handler/AoiStart.js")(this);
            await require("../handler/NonIntents/ready.js")(this);
        });
        this.login(options.token);
    }

    status(...statuses) {
        for (const status of statuses) {
            status.type =
                Object.keys(ActivityTypeAvailables).includes(status.type) ||
                Object.values(ActivityTypeAvailables).includes(status.type)
                    ? ActivityTypeAvailables[status.type]
                    : ActivityTypeAvailables.PLAYING;
            const option = {
                name: status.text,
                type: status.type,
                url: status.url,
            };

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
        options.makeCache = await CacheManager._setDjsCacheManagers(
            options.cache,
        );
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
        }
    }
}

module.exports = BaseClient;
