"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aoi_compiler_1 = require("aoi-compiler");
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const option_1 = __importDefault(require("../util/functions/option"));
class FunctionManager {
    nativeFunctions = new discord_js_1.Collection();
    #adapter = (0, option_1.default)();
    allFunctions = new discord_js_1.Collection();
    inside = (0, option_1.default)();
    constructor() {
        this.#loadNativeFunctions();
        this.#adapt();
    }
    #adapt() {
        if (this.#adapter)
            return;
        const fns = new Array();
        {
            const iterator = this.nativeFunctions.values();
            let item;
            while (item = iterator.next()) {
                if (item.done)
                    break;
                fns.push({
                    name: item.value.name,
                    brackets: item.value.brackets ?? false
                });
            }
        }
        this.#adapter = (0, aoi_compiler_1.sort_array)(fns);
    }
    get adapter() {
        if (!this.#adapter) {
            this.#adapt();
        }
        return this.#adapter;
    }
    setInside(str) {
        this.inside = str;
        return this;
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
 * Do not assing this anywhere, you can statically require and use it.
 * This is cached by the process.
 */
exports.default = new FunctionManager();
//# sourceMappingURL=FunctionManager.js.map