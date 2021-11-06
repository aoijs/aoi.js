const Constants = require('../Utils/Constants.js')
const Discord = require("discord.js")
class Util {
    static constants = Constants

    static getUser(d, id) {
        let user = d.client.users.cache.get(id)
        if (!user) {
            user = this.fetchUser(d, id)
        }
        return user
    }
    static async fetchUser(d, id) {
        return d.client.users.fetch(id).catch(err => undefined)
    }
    static async fetchChannel(d, id) {
        return d.client.channels.fetch(id).catch(e => undefined)
    }
    static getChannel(d, id, force = false) {
        if (d.channel?.id === id) return d.channel;
        else {
            let channel = d.client.channels.cache.get(id)
            if (!channel && force) channel = this.fetchChannel(d, id)
            return channel
        }
    }
    static async fetchMember(guild, id) {
        return guild.members.fetch(id).catch(err => undefined)
    }
    static async fetchMembers(guild, options) {
        return guild.members.fetch(options)
    }
    static getMember(guild, id) {
        let member = guild.members.cache.get(id)
        if (!member) member = this.fetchMember(guild, id)
        return member
    }
    static getMembers(guild, options = { type: "startsWith", query: "", limit: 10 }, force = false) {
        let members;
        if (!force) {
            members = guild.members.cache.filter(x => x.user.username.toLowerCase()[options.type](options.query) || x.displayName?.toLowerCase()[options.type](options.query)).first(options.limit);
        }
        else {
            members = this.fetchMembers(guild, options)
        }
        return members
    }
    static async fetchMessage(channel, id) {
        return channel.messages.fetch(id).catch(err => undefined)

    }
    static getMessage(channel, id) {
        let message = channel.messages.cache.get(id)
        if (!message) message = this.fetchMessage(channel, id)
        return message
    }
    static setCode(options = {}, esacpe = true) {
        return options.code.replaceLast(options.inside ? `${options.function}${options.inside}` : `${options.function}`, (esacpe ? options.result?.toString()?.deleteBrackets() : options.result.toString()) ?? " ");
    }
    static async getGuild(d, id) {
        if (d.guild?.id === id && d.guild?.id) return d.guild;
        else {
            if (!d.client.clientShard) return d.client.guilds.cache.get(id);
            else {
                const arr = await d.client.clientShard.broadcastEval(client => client.guilds.cache.get(id));
                return arr.find(x => x);
            }
        }
    }
    static get channelTypes() {
        return {
            Text: "GUILD_TEXT",
            Dm: "DM",
            Voice: "GUILD_VOICE",
            GroupDm: "GROUP_DM",
            Category: "GUILD_CATEGORY",
            News: "GUILD_NEWS",
            Store: "GUILD_STORE",
            NewsThread: "GUILD_NEWS_THREAD",
            PublicThread: "GUILD_PUBLIC_THREAD",
            PrivateThread: "GUILD_PRIVATE_THREAD",
            Stage: "GUILD_STAGE_VOICE",
            Unknown: "UNKNOWN"
        }
    }
    static get threadTypes() {
        return {
            public: "GUILD_PUBLIC_THREAD",
            private: "GUILD_PRIVATE_THREAD"
        }
    }
    static async errorParser(error, d) {
        const parsers = require('../Handler/parsers.js')
        try {
            error = JSON.parse(error)
            if (error.embeds?.includes("{newEmbed:")) {
                error.embeds = await parsers.EmbedParser(error.embeds || "")
            }
            if (error.components?.includes("{actionRow:")) {
                error.components = await parsers.ComponentParser(error.components || "", d.client)

            }
            if (typeof error.options === "string" && ["{reactions:", "{edit:", "{deletecommand:", "{delete:"].some(x => error.options?.includes(x))) {

                error.options = await parsers.OptionParser(error.options || "", d)
            }
            if (error.embeds?.includes("{attachment:") || error.embeds?.includes("{file:")) {
                error.files = await parsers.FileParser(error.files || "")

            }
        }
        catch (e) {
            error = await parsers.ErrorHandler(d, error, true)
        }
        return error;
    }
    static openFunc(d, FieldsRequired = true) {
        const data = {
            code: d.command.code,
            inside: d.unpack(),
            function: d.func
        }
        if (FieldsRequired) {
            data.err = d.inside(data.inside)
        }
        return data
    }
    static getEmoji(d, Emoji) {
        return d.client.emojis.cache.find(x => x.name.toLowerCase() === Emoji.toLowerCase().addBrackets() || x.id === Emoji || x.toString() === Emoji)
    }
    static getSticker(guild, Sticker) {
        return guild.stickers.cache.find(x => x.name.toLowerCase() === Sticker.toLowerCase().addBrackets() || x.id === Sticker)
    }
    static async findId(d, id) {
        const data = this.getGuild(d, id) || await this.getUser(d, id) || await this.getChannel(d, id, false) || await this.getMessage(d.channel, id) || this.getEmoji(d, id) || this.getSticker(d.guild, id) || "nope"
        return data
    }
}
module.exports = Util;
