"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoiCommandManager = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const Command_1 = require("../structures/Command");
const CommandType_1 = require("../typings/enums/CommandType");
const cast_1 = __importDefault(require("../util/functions/cast"));
const option_1 = __importDefault(require("../util/functions/option"));
const AoiError_1 = require("./AoiError");
/**
 * Stores commands for the Client.
 */
class AoiCommandManager extends discord_js_1.Collection {
    #client;
    directory = (0, option_1.default)();
    constructor(client) {
        super();
        this.#client = client;
    }
    add(type, data) {
        const col = this.ensure(this.#getStringType(type), () => new discord_js_1.Collection());
        col.set(col.size, this.#create(data, type));
        return this;
    }
    #getStringType(type) {
        if (CommandType_1.CommandType[type] === undefined) {
            throw new AoiError_1.AoiError("INVALID_COMMAND_TYPE", type);
        }
        return typeof type === 'number' ? CommandType_1.CommandType[type] : type;
    }
    get client() {
        return this.#client;
    }
    #validateType(type) {
        return this.get(this.#getStringType(type))?.size ?? 0;
    }
    #create(data, type) {
        type = (data.type ?? type);
        return new Command_1.Command(type, this.#validateType(type), this, data);
    }
    addMany(type, ...data) {
        for (let i = 0, len = data.length; i < len; i++) {
            const d = data[i];
            if (Array.isArray(d)) {
                for (let x = 0, len2 = d.length; x < len2; x++) {
                    this.add(type, d[x]);
                }
            }
            else {
                this.add(type, d);
            }
        }
        return this;
    }
    addUnknown(data) {
        const arr = new Array();
        if (Array.isArray(data)) {
            for (let i = 0, len = data.length; i < len; i++) {
                const d = data[i];
                const cmd = this.#create(d);
                arr.push(cmd);
                const col = this.getOrSet(cmd.data.type);
                col.set(col.size, cmd);
            }
        }
        else {
            const cmd = this.#create(data);
            arr.push(cmd);
            const col = this.getOrSet(cmd.data.type);
            col.set(col.size, cmd);
        }
        return arr;
    }
    addRaw(...data) {
        for (let i = 0, len = data.length; i < len; i++) {
            const d = data[i];
            if (Array.isArray(d)) {
                for (let x = 0, len2 = d.length; x < len2; x++) {
                    const c = d[x];
                    this.add(c.type, c);
                }
            }
            else {
                this.add(d.type, d);
            }
        }
        return this;
    }
    get(type) {
        return super.get(this.#getStringType(type));
    }
    getOrSet(type) {
        if (!super.has(this.#getStringType(type))) {
            super.set(this.#getStringType(type), new discord_js_1.Collection());
        }
        return (0, cast_1.default)(super.get(this.#getStringType(type)));
    }
    create(id, type, data) {
        return new Command_1.Command(type, id, this, data);
    }
    fromStatus(data) {
        return new Command_1.Command('unknown', 0, this, {
            name: "status",
            type: 'basicCommand',
            code: data.name
        }, data.compiler);
    }
    refresh() {
        if (!this.directory)
            return false;
        for (const [, commands] of this) {
            for (const [, command] of commands) {
                if (!command.path) {
                    continue;
                }
                commands.delete(command.id);
                delete require.cache[require.resolve(command.path)];
            }
        }
        this.load(this.directory);
        return true;
    }
    load(directory) {
        this.directory = this.directory ?? directory;
        if (!(0, fs_1.existsSync)(directory)) {
            throw new AoiError_1.AoiError("DIRECTORY_DOES_NOT_EXIST", directory);
        }
        const files = (0, fs_1.readdirSync)(directory);
        for (let i = 0, len = files.length; i < len; i++) {
            const file = files[i];
            const tpath = `${directory}/${file}`;
            const stats = (0, fs_1.statSync)(tpath);
            if (stats.isDirectory()) {
                this.load(tpath + "/");
            }
            else {
                if (!file.endsWith('.js')) {
                    continue;
                }
                const reqPath = `${process.cwd()}/${directory}/${file}`;
                const req = require(reqPath);
                // Allow passing ts default imports.
                const data = req.default ?? req;
                if (!Object.keys(data)) {
                    continue;
                }
                const processed = this["addUnknown"](data);
                for (let i = 0, len = processed.length; i < len; i++) {
                    const res = processed[i];
                    res.setPath(reqPath);
                }
            }
        }
    }
}
exports.AoiCommandManager = AoiCommandManager;
//# sourceMappingURL=AoiCommandManager.js.map