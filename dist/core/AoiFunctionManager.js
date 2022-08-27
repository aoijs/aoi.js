"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const option_1 = __importDefault(require("../util/functions/option"));
class AoiFunctionManager {
    nativeFunctions = new discord_js_1.Collection();
    #adapter = (0, option_1.default)();
    allFunctions = new discord_js_1.Collection();
    constructor() {
        this.#loadNativeFunctions();
        this.#adapt();
    }
    loadPlugins(plugins) {
        if (!plugins?.length)
            return;
        const cwd = `${process.cwd()}`;
        const loaded = [];
        for (let i = 0, len = plugins.length; i < len; i++) {
            const plugin = plugins[i];
            if (typeof plugin !== 'string') {
                const arr = Array.isArray(plugin) ? plugin : [plugin];
                for (let i = 0, len = arr.length; i < len; i++) {
                    const plugin = arr[i];
                    this.allFunctions.set(plugin.name, plugin);
                    loaded.push(plugin.name);
                }
            }
            const folder = plugin;
            if (!(0, fs_1.existsSync)(`${cwd}/${folder}`)) {
                process.emitWarning(`Plugin folder ${folder} does not exist`);
                continue;
            }
            const files = (0, fs_1.readdirSync)(`${cwd}/${folder}`);
            for (const file of files.filter(c => c.endsWith(".js"))) {
                const route = `${cwd}/${folder}/${file}`;
                const d = require(route);
                const data = d.default ?? d;
                if (!Object.keys(data).length) {
                    continue;
                }
                if (!data.name) {
                    continue;
                }
                this.allFunctions.set(data.name, data);
                loaded.push(data.name);
            }
        }
        if (loaded.length) {
            this.#adapt(true);
            console.log(`\x1b[31mAoiWarning: \x1b[33mThe following plugins were loaded: \x1b[34m${loaded.join(', ')}\x1b[0m`);
        }
        else {
            console.log(`No plugins were loaded.`);
        }
    }
    #adapt(refresh = false) {
        if (this.#adapter && !refresh)
            return;
        const fns = new Array();
        {
            const iterator = this.allFunctions.values();
            let item;
            while (item = iterator.next()) {
                if (item.done)
                    break;
                fns.push({
                    name: item.value.name,
                    brackets: item.value.brackets ?? false,
                    optional: item.value.optional ?? false
                });
            }
        }
        this.#adapter = fns.sort((x, y) => y.name.length - x.name.length);
    }
    get adapter() {
        if (!this.#adapter) {
            this.#adapt();
        }
        return this.#adapter;
    }
    #loadNativeFunctions() {
        const files = (0, fs_1.readdirSync)(__dirname + `/../functions/`).filter(c => c.endsWith('.js'));
        for (let i = 0, len = files.length; i < len; i++) {
            const data = require(`../functions/${files[i]}`).default;
            this.nativeFunctions.set(data.name, data);
            this.allFunctions.set(data.name, data);
        }
    }
}
/**
 * Do not assign this anywhere, you can statically require and use it.
 * This is cached by the process.
 */
exports.default = new AoiFunctionManager();
//# sourceMappingURL=AoiFunctionManager.js.map