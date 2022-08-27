"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const discord_js_1 = require("discord.js");
const option_1 = __importDefault(require("../util/functions/option"));
/**
 * The context stores a class from discord.js.
 */
class Context {
    data;
    #user = (0, option_1.default)();
    #guild = (0, option_1.default)();
    #member = (0, option_1.default)();
    $memberManager = (0, option_1.default)();
    #channel = (0, option_1.default)();
    #message = (0, option_1.default)();
    constructor(data) {
        this.data = data;
    }
    isMessage() {
        return this.data instanceof discord_js_1.Message;
    }
    isUser() {
        return this.data instanceof discord_js_1.User;
    }
    isGuildMember() {
        return this.data instanceof discord_js_1.GuildMember;
    }
    isGuild() {
        return this.data instanceof discord_js_1.Guild;
    }
    isInteraction() {
        return this.data instanceof discord_js_1.ButtonInteraction || this.data instanceof discord_js_1.SelectMenuInteraction || this.data instanceof discord_js_1.ModalSubmitInteraction;
    }
    isChannel() {
        return this.data instanceof discord_js_1.BaseChannel;
    }
    as() {
        return this;
    }
    set(key, value) {
        this[key] = value;
        return this;
    }
    getMainChannel() {
        if (this.#channel)
            return this.#channel;
        if (this.isMessage()) {
            return this.setChannel(this.data.channel);
        }
        else if (this.isInteraction()) {
            return this.setChannel(this.data.channel);
        }
        else if (this.isUser()) {
            return this.setChannel(this.data.dmChannel);
        }
        return null;
    }
    isAutocompleteInteraction() {
        return this.data instanceof discord_js_1.AutocompleteInteraction;
    }
    getAutocompleteInteraction() {
        return this.isAutocompleteInteraction() ? this.data : null;
    }
    setChannel(channel) {
        return this.#channel = channel;
    }
    setMessage(m) {
        return this.#message = m;
    }
    setGuild(guild) {
        return this.#guild = guild;
    }
    setUser(user) {
        return this.#user = user;
    }
    setMember(member) {
        return this.#member = member;
    }
    /**
     * Gets the context guild, this is not guaranteed.
     */
    getGuild() {
        if (this.#guild)
            return this.#guild;
        if (this.isGuildMember()) {
            return this.setGuild(this.data.guild);
        }
        else if (this.isMessage()) {
            return this.setGuild(this.data.guild);
        }
        else if (this.isInteraction()) {
            return this.setGuild(this.data.guild);
        }
        else if (this.isGuild()) {
            return this.setGuild(this.data);
        }
        return null;
    }
    getMessage() {
        if (this.#message)
            return this.#message;
        if (this.isMessage()) {
            return this.setMessage(this.data);
        }
        else if (this.isInteraction()) {
            return this.setMessage(this.data.message ?? null);
        }
        else if (this.isReactionMessage()) {
            return this.setMessage(this.data.message);
        }
        return null;
    }
    isReactionMessage() {
        return this.data instanceof discord_js_1.MessageReaction;
    }
    /**
     * Gets the context guild member, if any.
     */
    async getGuildMember() {
        if (this.isGuildMember()) {
            return this.setMember(this.data);
        }
        else if (this.isMessage()) {
            return this.setMember(this.data.member);
        }
        else if (this.isGuild()) {
            // @ts-ignore
            return this.setMember(await this.$memberManager?.fetchMe());
        }
        return null;
    }
    /**
     * Gets the context user, this is not guaranteed.
     * @returns
     */
    getUser() {
        if (this.#user)
            return this.#user;
        if (this.isMessage()) {
            return this.setUser(this.data.author);
        }
        else if (this.isGuildMember()) {
            return this.setUser(this.data.user);
        }
        else if (this.isUser()) {
            return this.setUser(this.data);
        }
        else if (this.isInteraction()) {
            return this.setUser(this.data.user);
        }
        return null;
    }
    getInteraction() {
        return this.isInteraction() ? this.data : null;
    }
    isContextMenuInteraction() {
        return this.data instanceof discord_js_1.ContextMenuCommandInteraction;
    }
    getContextMenuInteraction() {
        return this.isContextMenuInteraction() ? this.data : null;
    }
    getSlashCommand() {
        return this.isSlashCommand() ? this.data : null;
    }
    isSlashCommand() {
        return this.data instanceof discord_js_1.CommandInteraction;
    }
}
exports.Context = Context;
//# sourceMappingURL=Context.js.map