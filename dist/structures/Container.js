"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const discord_js_1 = require("discord.js");
const cast_1 = __importDefault(require("../util/functions/cast"));
const noop_1 = __importDefault(require("../util/functions/noop"));
const option_1 = __importDefault(require("../util/functions/option"));
class Container {
    channel = (0, option_1.default)();
    data = {
        content: null,
        components: [],
        files: [],
        attachments: [],
        embeds: [],
        replyType: "send",
        ephemeral: false,
        fetchReply: false
    };
    constructor() {
    }
    setChannel(ch) {
        this.channel = ch;
        return this;
    }
    #createReply() {
        // @ts-ignore
        const data = {
            content: this.data.content || null,
            components: this.data.components,
            embeds: this.data.embeds,
            fetchReply: this.data.fetchReply,
            files: this.data.files,
            attachments: this.data.attachments,
            ephemeral: this.data.ephemeral
        };
        return data;
    }
    reset() {
        this.data = new Container().data;
    }
    async send(content = this.data.content, channel = this.channel) {
        if (!channel)
            return null;
        this.data.content = content;
        let data = null;
        if (channel instanceof discord_js_1.BaseInteraction) {
            if (channel.type === discord_js_1.InteractionType.ApplicationCommandAutocomplete) {
                data = await channel.respond([]).catch(noop_1.default);
            }
            else {
                if (this.data.replyType === 'send') {
                    this.data.replyType = 'reply';
                }
                if (channel.isRepliable() && channel.deferred) {
                    this.data.replyType = 'editReply';
                }
                data = await channel[this.data.replyType]?.(this.#createReply()).catch(noop_1.default);
            }
        }
        else if (channel instanceof discord_js_1.User || channel instanceof discord_js_1.GuildMember) {
            data = (0, cast_1.default)(await channel.send(this.#createReply()).catch(noop_1.default));
        }
        else if (channel instanceof discord_js_1.Message) {
            data = (0, cast_1.default)(await channel[this.data.replyType !== 'reply' ? 'edit' : 'reply'](this.#createReply()).catch(noop_1.default));
        }
        else if (channel instanceof discord_js_1.TextChannel) {
            data = (0, cast_1.default)(await channel.send(this.#createReply()).catch(noop_1.default));
        }
        else {
            console.warn(`Do not know how to reply to instance ${channel.constructor.name}.`);
        }
        this.reset();
        return data ?? null;
    }
    /**
     *
     * @param src
     * @returns The source.
     */
    copyTo(src) {
        src.data = this.data;
        return src;
    }
}
exports.Container = Container;
//# sourceMappingURL=Container.js.map