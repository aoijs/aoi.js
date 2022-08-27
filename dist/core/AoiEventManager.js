"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoiEventManager = void 0;
const fs_1 = require("fs");
const AoiEvents_1 = require("../typings/enums/AoiEvents");
const AoiError_1 = require("./AoiError");
class AoiEventManager {
    #bot;
    #events = new Array();
    constructor(bot) {
        this.#bot = bot;
    }
    has(event) {
        return this.#events.includes(event);
    }
    listen() {
        for (let i = 0, len = this.#events.length; i < len; i++) {
            const event = this.#events[i];
            const fn = require(`../events/${event}.js`).default;
            this.#bot.client.on(event, fn.bind(this.#bot));
        }
    }
    addRaw(...events) {
        for (let i = 0, len = events.length; i < len; i++) {
            const ev = events[i];
            if (Array.isArray(ev)) {
                for (let x = 0, len2 = ev.length; x < len2; x++) {
                    this.addRaw(ev[x]);
                }
            }
            else {
                this.#events.push(ev);
            }
        }
        return this;
    }
    add(...events) {
        for (let i = 0, len = events.length; i < len; i++) {
            const ev = events[i];
            if (Array.isArray(ev)) {
                for (let x = 0, len2 = ev.length; x < len2; x++) {
                    this.add(ev[x]);
                }
            }
            else {
                const getter = AoiEvents_1.AoiEvents[ev];
                if (getter === undefined) {
                    throw new AoiError_1.AoiError("UNKNOWN_DISCORD_EVENT", ev);
                }
                this.#events.push(getter);
            }
        }
        return this;
    }
    /**
     * Loads aoi.js events from given directory.
     */
    load(directory) {
        if (!(0, fs_1.existsSync)(directory)) {
            throw new AoiError_1.AoiError("DIRECTORY_DOES_NOT_EXIST", directory);
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
}
exports.AoiEventManager = AoiEventManager;
//# sourceMappingURL=AoiEventManager.js.map