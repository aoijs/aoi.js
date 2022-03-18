"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const getFunctionRegex_1 = __importDefault(require("../util/functions/getFunctionRegex"));
const option_1 = __importDefault(require("../util/functions/option"));
class FunctionManager {
    nativeFunctions = new discord_js_1.Collection();
    #regex = (0, option_1.default)();
    #fregex = (0, option_1.default)();
    constructor() {
        this.#loadNativeFunctions();
    }
    get fregex() {
        if (!this.#fregex) {
            this.#fregex = new RegExp(`(${this.nativeFunctions.map(f => `\\${f.name}`).join('|')})`, 'g');
        }
        return this.#fregex;
    }
    get regex() {
        if (!this.#regex) {
            this.#regex = new RegExp(`(${this.nativeFunctions.map(f => (0, getFunctionRegex_1.default)(f)).join('|')})`, 'g');
        }
        return this.#regex;
    }
    #loadNativeFunctions() {
        const files = (0, fs_1.readdirSync)(__dirname + `/../functions/`).filter(c => c.endsWith('.js'));
        for (let i = 0, len = files.length; i < len; i++) {
            const data = require(`../functions/${files[i]}`).default;
            this.nativeFunctions.set(data.name, data);
        }
    }
    matches(str) {
        return str.matchAll(this.regex);
    }
}
/**
 * Do not assing this anywhere, you can statically require and use it.
 * This is cached by the process.
 */
exports.default = new FunctionManager();
//# sourceMappingURL=FunctionManager.js.map