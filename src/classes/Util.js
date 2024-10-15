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
        else {
            if (!d.client.shard) return d.client.guilds.cache.get(id);
            else {
                const arr = await d.client.shard.broadcastEval((client) => client.guilds.cache.get(id));
                return arr.find((x) => x);
            }
        }
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

    static getEmoji(d, Emoji) {
        if (!Emoji) return;
        if (Emoji.includes(":")) {
            Emoji = Emoji.split(":")[2].split(">")[0];
        }

        const clientEmojis = d.client.emojis.cache.find((x) => x.name.toLowerCase().addBrackets() === Emoji.toLowerCase() || x.id === Emoji || x.toString() === Emoji);

        if (clientEmojis) return clientEmojis;

        const application = d.client.application;
        const fetchEmojis = application.emojis.cache.size ? Promise.resolve() : application.emojis.fetch();

        return fetchEmojis.then(() => {
            const appEmojis = application.emojis.cache.find((x) => x.name.toLowerCase().addBrackets() === Emoji.toLowerCase() || x.id === Emoji || x.toString() === Emoji);

            return appEmojis;
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
}

Util.searchType = ["soundcloud", "localfile", "url", "youtube", "spotify"];
Util.audioFilters = {
    nightcore: (value) => {
        return {
            asetrate: 48000 * value,
            aresample: 48000
        };
    },
    bassboost: (value) => {
        return {
            bass: `g=${value}`
        };
    },
    "8d": () => {
        return {
            extrastereo: "",
            aecho: "1:1:40:0.5",
            apulsator: "hz=0.125",
            stereowiden: ""
        };
    },
    pitch: (value) => {
        return {
            asetrate: 48000 * value,
            atempo: 1 - Number(`${value}`.split(".")[1]),
            aresample: 48000
        };
    },
    karaoke: (value) => {
        return {
            stereotools: `mlev=${0.015625 * value}`
        };
    },
    slowed: (value) => {
        return {
            asetrate: 48000 * Math.abs(Math.ceil(value) - value),
            aresample: 48000
        };
    },
    deep: (value) => {
        return {
            asetrate: 48000 * Math.abs(Math.ceil(value) - value),
            atempo: 2 - Math.abs(Math.ceil(value) - value),
            aresample: 48000
        };
    }
};

module.exports = Util;
