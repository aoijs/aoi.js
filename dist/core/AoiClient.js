"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoiClient = void 0;
const discord_js_1 = require("discord.js");
const ms_utility_1 = __importDefault(require("ms-utility"));
const AoiWarning_1 = __importDefault(require("../handlers/AoiWarning"));
const DefaultReadyLogger_1 = __importDefault(require("../handlers/DefaultReadyLogger"));
const readyCommands_1 = __importDefault(require("../handlers/readyCommands"));
const AoiDefaultOptions_1 = require("../util/constants/AoiDefaultOptions");
const Util_1 = require("../util/Util");
const AoiCommandManager_1 = require("./AoiCommandManager");
const AoiError_1 = require("./AoiError");
const AoiEventManager_1 = require("./AoiEventManager");
const AoiFunctionManager_1 = __importDefault(require("./AoiFunctionManager"));
const AoiStatusManager_1 = require("./AoiStatusManager");
class AoiClient {
    /**
     * The client managed by this Client.
     */
    client;
    db;
    status = new AoiStatusManager_1.AoiStatusManager(this);
    /**
     * The commands for this Client.
     */
    commands = new AoiCommandManager_1.AoiCommandManager(this);
    parser;
    /**
     * The events added to this client.
     */
    events = new AoiEventManager_1.AoiEventManager(this);
    /**
     * Options passed to the Client.
     */
    options;
    /**
     *
     * @param options The options to pass to Client.
     */
    constructor(options) {
        this.options = Util_1.Util.mergeDefault(options, AoiDefaultOptions_1.AoiDefaultOptions);
        this.#validateOptions();
        this.client = new discord_js_1.Client(options.client);
    }
    isDatabase(instance) {
        return this.db instanceof instance;
    }
    #validateOptions() {
        if (this.options.intents) {
            this.options.client.intents = this.#resolveIntents();
        }
        this.parser = new ms_utility_1.default(this.options.units);
        AoiFunctionManager_1.default.loadPlugins(this.options.plugins);
    }
    get prefixes() {
        if (typeof this.options.prefix === 'string') {
            return [
                this.options.prefix
            ];
        }
        else if (Array.isArray(this.options.prefix)) {
            return this.options.prefix;
        }
        else {
            const options = this.options.prefix;
            const prefixes = new Array(...options.prefixes);
            if (options.mentionPrefix) {
                prefixes.push(this.client.user.toString(), this.client.user.toString().replace("@", "@!"));
            }
            return prefixes;
        }
    }
    #resolveIntents() {
        const intents = this.options.intents;
        const newer = new Array();
        for (let i = 0, len = intents.length; i < len; i++) {
            const int = intents[i];
            // Djs made enums const, therefore they cannot be dynamically accessed anymore apparently (?)
            // @ts-ignore 
            const intent = discord_js_1.GatewayIntentBits[int];
            if (!intent) {
                throw new AoiError_1.AoiError("INVALID_INTENT", int);
            }
            newer.push(intent);
        }
        return newer;
    }
    get addRawEvent() {
        return this.events.addRaw.bind(this.events);
    }
    get addEvent() {
        return this.events.add.bind(this.events);
    }
    get addCommand() {
        return this.commands.addRaw.bind(this.commands);
    }
    get addStatus() {
        return this.status.add.bind(this.status);
    }
    get login() {
        return this.start.bind(this);
    }
    start(token = this.options.token) {
        if (!token) {
            throw new AoiError_1.AoiError("TOKEN_NOT_PROVIDED");
        }
        this.events["listen"]();
        this.#registerReadyCommand();
        this.client.login(token)
            .then(() => {
            this.status["start"]();
        });
    }
    #registerReadyCommand() {
        this.client.once("ready", _ => {
            (0, AoiWarning_1.default)();
            if (this.commands.has('readyCommand')) {
                readyCommands_1.default.call(this);
            }
            else {
                DefaultReadyLogger_1.default.call(this, this.client);
            }
        });
    }
}
exports.AoiClient = AoiClient;
//# sourceMappingURL=AoiClient.js.map