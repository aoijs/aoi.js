"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThisArg = void 0;
const builders_1 = require("@discordjs/builders");
const util_1 = require("util");
const core_1 = require("../core");
const typings_1 = require("../typings");
const Return_1 = require("./Return");
class ThisArg {
    data;
    environment = {};
    keywords = {};
    constructor(data) {
        this.data = data;
    }
    getKeyword(name) {
        return this.keywords[name] ?? null;
    }
    setEnvironmentValue(key, value) {
        this.environment[key] = value;
        return this;
    }
    getEnvironmentValue(...args) {
        let itm = this.environment;
        for (let i = 0, len = args.length; i < len; i++) {
            const has = itm[args[i]];
            if (has === undefined)
                return '';
            itm = has;
        }
        return typeof itm === 'object' ? (0, util_1.inspect)(itm, { depth: 0 }) : itm ?? '';
    }
    get container() {
        return this.data.container;
    }
    get reference() {
        return this.data.ref;
    }
    embed(index) {
        if (index < 1)
            index = 1;
        const embed = this.container.data.embeds[--index];
        if (!embed) {
            while (!this.container.data.embeds[index]) {
                this.container.data.embeds.push(new builders_1.EmbedBuilder());
            }
        }
        return this.container.data.embeds[index];
    }
    ok(data) {
        return Return_1.Return.success(data);
    }
    async handleError(res) {
        const err = res.unwrapAs();
        if (res.isError()) {
            this.container.reset();
        }
        if (this.container.channel) {
            await this.container.send(err);
        }
        else {
            console.error(err);
        }
        return null;
    }
    get bot() {
        return this.data.bot;
    }
    get context() {
        return this.data.context;
    }
    get command() {
        return this.data.command;
    }
    get(key) {
        return this.data[key];
    }
    async manage(r, cb) {
        if (r.isSuccess()) {
            return cb(r.unwrap());
        }
        if (r.isAnyError() || r.isReturnKeyword()) {
            return r;
        }
        if (r.isBreakStatement()) {
            throw new core_1.AoiError(typings_1.ErrorMessages.ILLEGAL_STATEMENT, "Break");
        }
        throw new core_1.AoiError(typings_1.ErrorMessages.UNKNOWN_RETURN, r.type);
    }
    setReply(type) {
        this.container.data.replyType = type;
        return this;
    }
    mustReturn(r) {
        return r.isAnyError() || r.isReturnKeyword();
    }
    mustReturnPlusBreak(r) {
        return r.isAnyError() || r.isReturnKeyword() || r.isBreakStatement();
    }
}
exports.ThisArg = ThisArg;
//# sourceMappingURL=ThisArg.js.map