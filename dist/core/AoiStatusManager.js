"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoiStatusManager = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const __1 = require("..");
const InterpreterReturnType_1 = require("../util/constants/enums/InterpreterReturnType");
const cast_1 = __importDefault(require("../util/functions/cast"));
const compile_1 = __importDefault(require("../util/functions/compile"));
const interpreter_1 = __importDefault(require("../util/functions/interpreter"));
const sleep_1 = __importDefault(require("../util/functions/sleep"));
class AoiStatusManager {
    #bot;
    #statuses = new Array();
    #alive = false;
    #current = 0;
    constructor(bot) {
        this.#bot = bot;
    }
    start() {
        if (this.#alive)
            return this;
        this.#alive = true;
        this.#cycle();
        return this;
    }
    async #cycle() {
        if (!this.#alive)
            return;
        if (!this.#statuses.length) {
            this.#alive = false;
            return;
        }
        const status = this.#statuses[this.#current++] ?? this.#statuses[0];
        if (!this.#statuses[this.#current])
            this.#current = 0;
        const output = await (0, interpreter_1.default)({
            return: InterpreterReturnType_1.InterpreterReturnType.Output,
            bot: this.#bot,
            command: this.#bot.commands["fromStatus"](status),
            context: this.#bot.client.user
        });
        if (output) {
            this.#bot.client.user?.setPresence({
                afk: status.afk,
                status: status.presence ?? 'online',
                activities: [
                    {
                        name: output,
                        type: (0, cast_1.default)(status.type ? discord_js_1.ActivityType[status.type] : discord_js_1.ActivityType.Playing),
                        url: status.url
                    }
                ]
            });
        }
        await (0, sleep_1.default)(status.duration ?? 15_000);
        this.#cycle();
    }
    load(directory) {
        if (!(0, fs_1.existsSync)(directory)) {
            throw new __1.AoiError("DIRECTORY_DOES_NOT_EXIST", directory);
        }
        const files = (0, fs_1.readdirSync)(directory).filter(c => c.endsWith('.js'));
        for (let i = 0, len = files.length; i < len; i++) {
            const file = files[i];
            const req = require(process.cwd() + `/${directory}/${file}`);
            /**
             * Allow ts generated files.
             */
            const data = req.default ?? req;
            /**
             * Check if there is anything to load from here.
             */
            if (!Object.keys(data)) {
                continue;
            }
            this.add(data);
        }
        return this;
    }
    add(...status) {
        for (let i = 0, len = status.length; i < len; i++) {
            const st = status[i];
            if (Array.isArray(st)) {
                for (let x = 0, len2 = st.length; x < len2; x++) {
                    this.add(st[x]);
                }
            }
            else {
                this.#statuses.push(this.#transform(st));
            }
        }
        return this;
    }
    #transform(status) {
        return {
            ...status,
            compiler: (0, compile_1.default)(status.name, this.#bot.options.insensitive)
        };
    }
}
exports.AoiStatusManager = AoiStatusManager;
//# sourceMappingURL=AoiStatusManager.js.map