const Constants = require("../utils/Constants.js");
const Discord = require("discord.js");
const parsers = require("../events/parsers.js");

class Util {
    static constants = Constants;
    static parsers = parsers;

    static async getUser(d, id) {
        let user = d.client.users.cache.get(id);
        if (!user) {
            user = await this.fetchUser(d, id);
        }
        return user;
    }

    static async fetchUser(d, id) {
        try {
            return await d.client.users.fetch(id, { force: true });
        } catch (err) {
            return undefined;
        }
    }

    static async fetchChannel(d, id) {
        try {
            return await d.client.channels.fetch(id, { force: true });
        } catch (e) {
            return undefined;
        }
    }

    static getChannel(d, id, force = false) {
        if (d.channel?.id === id) return d.channel;
        else {
            let channel = d.client.channels.cache.get(id);
            if (!channel && force) channel = this.fetchChannel(d, id);
            return channel;
        }
    }

    static async fetchMember(guild, id) {
        try {
            return await guild.members.fetch(id, { force: true });
        } catch (err) {
            return undefined;
        }
    }

    static async fetchMembers(guild, options) {
        return guild.members.fetch(options);
    }

    static getMember(guild, id) {
        let member = guild.members.cache.get(id);
        if (!member) member = this.fetchMember(guild, id);
        return member;
    }

    static getMembers(guild, options = { type: "startsWith", query: "", limit: 10 }, force = false) {
        let members;
        if (!force) {
            members = guild.members.cache.filter((x) => x.user.username.toLowerCase()[options.type](options.query) || x.displayName?.toLowerCase()[options.type](options.query)).first(options.limit);
        } else {
            members = this.fetchMembers(guild, options);
        }
        return members;
    }

    static async fetchMessage(channel, id) {
        try {
            return await channel.messages.fetch(id, { force: true });
        } catch (err) {
            return undefined;
        }
    }

    static getMessage(channel, id) {
        let message = channel.messages.cache.get(id);
        if (!message) message = this.fetchMessage(channel, id);
        return message;
    }

    static setCode(options = {}, escape = true) {
        return options.code.replaceLast(
            options.inside ? `${options.function}${options.inside}` : `${options.function}`,
            (escape ? options.result?.toString()?.deleteBrackets() : options.result.toString()) ?? ""
        );
    }

    static async getGuild(d, id) {
        if (d.guild?.id === id && d.guild?.id) return d.guild;

        return d.client.guilds.cache.get(id) || (await d.client.guilds.fetch(id, { force: true }));
    }

    static get channelTypes() {
        return {
            Text: Discord.ChannelType.GuildText,
            Voice: Discord.ChannelType.GuildVoice,
            Category: Discord.ChannelType.GuildCategory,
            DM: Discord.ChannelType.DM,
            Announcement: Discord.ChannelType.GuildAnnouncement,
            AnnouncementThread: Discord.ChannelType.AnnouncementThread,
            PublicThread: Discord.ChannelType.PublicThread,
            PrivateThread: Discord.ChannelType.PrivateThread,
            Stage: Discord.ChannelType.GuildStageVoice,
            Forum: Discord.ChannelType.GuildForum,
            Media: Discord.ChannelType.GuildMedia,
            GuildDirectory: Discord.ChannelType.GuildDirectory,
            GroupDM: Discord.ChannelType.GroupDM
        };
    }

    static get threadTypes() {
        return {
            public: Discord.ChannelType.PublicThread,
            private: Discord.ChannelType.PrivateThread
        };
    }

    static async errorParser(errorM, d) {
        let error;
        if (typeof errorM === "object") return errorM;

        try {
            error = await this.parsers.ErrorHandler(errorM, d, true);
        } catch (e) {
            error = undefined;
        }
        return error;
    }

    static async getRole(guild, id) {
        try {
            let role = guild.roles.cache.get(id);
            if (!role) role = await this.fetchRole(guild, id);
            return role;
        } catch (err) {
            return undefined;
        }
    }

    static async fetchRole(guild, id) {
        try {
            return await guild.roles.fetch(id, { force: true });
        } catch (err) {
            return undefined;
        }
    }

    static aoiFunc(d, FieldsRequired = true) {
        const data = {
            inside: d.unpack(),
            code: d.command.code,
            function: d.func
        };
        if (FieldsRequired) {
            data.err = d.inside(data.inside);
        }
        return data;
    }

    static isUnicodeEmoji(str) {
        const emojiRegex = /(?:\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\u200D(?:\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?))*)|\d\uFE0F\u20E3/gu;
        return emojiRegex.test(str);
    }

    static async getEmoji(d, emoji, options) {
        const guild = typeof options === "object" ? await options.guild : null;

        if (!emoji) return;

        if (this.isUnicodeEmoji(emoji)) {
            return {
                id: null,
                name: emoji.trim(),
                animated: false
            };
        }

        let emojiId = emoji;
        if (emoji.includes(":")) {
            emojiId = emoji.split(":")[2].split(">")[0];
        }

        if (guild) {
            const guildEmoji = guild.emojis.cache.find((x) => x.name.toLowerCase() === emojiId.toLowerCase() || x.id === emojiId || x.toString() === emojiId);
            if (guildEmoji) return guildEmoji;
            else return undefined;
        }

        if (d.client.shard) {
            const clientEmojis = await d.client.shard.broadcastEval(
                (client, { emojiId }) => {
                    return client.emojis.cache.find((x) => x.name.toLowerCase() === emojiId.toLowerCase() || x.id === emojiId || x.toString() === emojiId);
                },
                { context: { emojiId } }
            );

            const foundEmoji = clientEmojis.find((x) => x);
            if (foundEmoji) return foundEmoji;
        } else {
            const clientEmoji = d.client.emojis.cache.find((x) => x.name.toLowerCase() === emojiId.toLowerCase() || x.id === emojiId || x.toString() === emojiId);
            if (clientEmoji) return clientEmoji;
        }

        const application = d.client.application;
        const fetchEmojis = application.emojis.cache.size ? Promise.resolve() : application.emojis.fetch();

        return fetchEmojis.then(() => {
            return application.emojis.cache.find((x) => x.name.toLowerCase() === emojiId.toLowerCase() || x.id === emojiId || x.toString() === emojiId);
        });
    }

    static getSticker(guild, Sticker) {
        return guild.stickers.cache.find((x) => x.name.toLowerCase() === Sticker.toLowerCase().addBrackets() || x.id === Sticker);
    }

    static findMember(guild, memberResolver) {
        return guild.members.cache.findKey(
            (x) =>
                x.displayName.toLowerCase() === memberResolver.toLowerCase() ||
                x.user.username.toLowerCase() === memberResolver.toLowerCase() ||
                x.id === memberResolver ||
                x.toString() === memberResolver
        );
    }

    static findGuildChannel(guild, ChannelResolver) {
        return guild.channels.cache.findKey((x) => x.name.toLowerCase() === ChannelResolver.toLowerCase() || x.id === ChannelResolver || x.toString() === ChannelResolver);
    }

    static findChannel(client, ChannelResolver) {
        return client.channels.cache.findKey((x) => x.name.toLowerCase() === ChannelResolver.toLowerCase() || x.id === ChannelResolver || x.toString() === ChannelResolver);
    }

    static findRole(guild, RoleResolver) {
        return guild.roles.cache.findKey((x) => x.name.toLowerCase() === RoleResolver.toLowerCase() || x.id === RoleResolver || x.toString() === RoleResolver);
    }

    static findUser(client, UserResolver) {
        return client.users.cache.findKey(
            (x) => x.username.toLowerCase() === UserResolver.toLowerCase() || x.tag.toLowerCase() === UserResolver.toLowerCase() || x.id === UserResolver || x.toString() === UserResolver
        );
    }

    static findRoles(guild, options = { type: "startsWith", query: "", limit: 10 }) {
        return guild.roles.cache
            .filter((x) => {
                return x.name.toLowerCase()[options.type](options.query.toLowerCase());
            })
            .first(options.limit);
    }

    static buildInside(keys, input) {
        const parseValue = (val) => {
            const v = val.trim();
            if (v.toLowerCase() === "null") return null;
            if (v.toLowerCase() === "true") return true;
            if (v.toLowerCase() === "false") return false;
            return v;
        };

        if (Array.isArray(input) && input.length > 1) {
            if (input.length > keys.length) {
                throw new Error(`Too many fields in input: expected ${keys.length}, got ${input.length}`);
            }
            const obj = {};
            keys.forEach((key, i) => {
                obj[key] = i < input.length ? parseValue(input[i]) : null;
            });
            return obj;
        }

        let strInput = Array.isArray(input) ? input[0] : input;
        if (typeof strInput === "string" && strInput.includes(":")) {
            const obj = {};
            strInput.split("\n").forEach((line, lineIndex) => {
                const clean = line.trim();
                if (!clean) return;

                const [key, ...rest] = clean.split(":");
                if (!key) return;

                const trimmedKey = key.trim();
                if (!keys.includes(trimmedKey)) {
                    throw new Error(`Invalid field "${trimmedKey}", expected one of: ${keys.join(", ")}`);
                }

                let value = rest.join(":").trim();

                let final = "";
                let escaped = false;
                for (let i = 0; i < value.length; i++) {
                    const char = value[i];
                    if (char === "\\" && !escaped) {
                        escaped = true;
                        continue;
                    }
                    final += (escaped ? "\\" : "") + char;
                    escaped = false;
                }

                if (final !== "") obj[trimmedKey] = parseValue(final);
            });

            return obj;
        }

        if (typeof strInput === "string") {
            const obj = {};
            let finalValues = [];
            let current = "";
            let escaped = false;

            for (let i = 0; i < strInput.length; i++) {
                const char = strInput[i];
                if (char === "\\" && !escaped) {
                    escaped = true;
                    continue;
                }
                current += (escaped ? "\\" : "") + char;
                escaped = false;
            }
            finalValues.push(current);

            keys.forEach((key, i) => {
                const val = finalValues[i] !== undefined ? finalValues[i] : "";
                obj[key] = val !== "" ? parseValue(val) : undefined;
            });

            return obj;
        }

        return {};
    }
}

module.exports = Util;
