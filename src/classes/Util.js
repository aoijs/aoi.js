const Constants = require("../utils/Constants.js");
const Discord = require("discord.js");

class Util {
  static constants = Constants;
  static parsers = require( "../handler/parsers.js" );
  static getUser(d, id) {
    let user = d.client.users.cache.get(id);
    if (!user) {
      user = this.fetchUser(d, id);
    }
    return user;
  }

  static async fetchUser(d, id) {
    return d.client.users.fetch(id, { force: true }).catch((err) => undefined);
  }

  static async fetchChannel(d, id) {
    return d.client.channels.fetch(id, { force: true }).catch((e) => undefined);
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
    return guild.members.fetch(id, { force: true }).catch((err) => undefined);
  }

  static async fetchMembers(guild, options) {
    return guild.members.fetch(options);
  }

  static getMember(guild, id) {
    let member = guild.members.cache.get(id);
    if (!member) member = this.fetchMember(guild, id);
    return member;
  }

  static getMembers(
    guild,
    options = { type: "startsWith", query: "", limit: 10 },
    force = false,
  ) {
    let members;
    if (!force) {
      members = guild.members.cache
        .filter(
          (x) =>
            x.user.username.toLowerCase()[options.type](options.query) ||
            x.displayName?.toLowerCase()[options.type](options.query),
        )
        .first(options.limit);
    } else {
      members = this.fetchMembers(guild, options);
    }
    return members;
  }

  static async fetchMessage(channel, id) {
    return channel.messages
      .fetch(id, { force: true })
      .catch((err) => undefined);
  }

  static getMessage(channel, id) {
    let message = channel.messages.cache.get(id);
    if (!message) message = this.fetchMessage(channel, id);
    return message;
  }

  static setCode(options = {}, esacpe = true) {
    return options.code.replaceLast(
      options.inside
        ? `${options.function}${options.inside}`
        : `${options.function}`,
      (esacpe
        ? options.result?.toString()?.deleteBrackets()
        : options.result.toString()) ?? "",
    );
  }

  static async getGuild(d, id) {
    if (d.guild?.id === id && d.guild?.id) return d.guild;
    else {
      if (!d.client.clientShard) return d.client.guilds.cache.get(id);
      else {
        const arr = await d.client.clientShard.broadcastEval((client) =>
          client.guilds.cache.get(id),
        );
        return arr.find((x) => x);
      }
    }
  }

  static get channelTypes() {
    return {
      Text: Discord.ChannelType.GuildText,
      DM: Discord.ChannelType.DM,
      Forum: Discord.ChannelType.GuildForum,
      Voice: Discord.ChannelType.GuildVoice,
      Category: Discord.ChannelType.GuildCategory,
      Announcement: Discord.ChannelType.GuildAnnouncement,
      AnnouncementThread: Discord.ChannelType.AnnouncementThread,
      PublicThread: Discord.ChannelType.PublicThread,
      PrivateThread: Discord.ChannelType.PrivateThread,
      Stage: Discord.ChannelType.GuildStageVoice,
      GuildDirectory: Discord.ChannelType.GuildDirectory
    };
  }

  static get threadTypes() {
    return {
      public: "GUILD_PUBLIC_THREAD",
      private: "GUILD_PRIVATE_THREAD",
    };
  }

  static async errorParser(errorM, d) {
    let error;
    if (typeof errorM === "object") return errorM;

    // try {
    //   let e = errorM;
    //   error = JSON.parse(e);
    //   if (error.embeds?.includes("{newEmbed:")) {
    //     error.embeds = await parsers.EmbedParser(error.embeds || "");
    //   }
    //   if (error.components?.includes("{actionRow:")) {
    //     error.components = await parsers.ComponentParser(
    //       error.components || "",
    //       d.client,
    //     );
    //   }
    //   if (
    //     error.files?.includes("{attachment") ||
    //     error.files?.includes("{file")
    //   ) {
    //     error.files = parsers.FileParser(error.files);
    //   }
    //   if (
    //     typeof error.options === "string" &&
    //     ["{reactions:", "{edit:", "{deletecommand:", "{delete:"].some((x) =>
    //       error.options?.includes(x),
    //     )
    //   ) {
    //     error.options = await parsers.OptionParser(error.options || "", d);
    //   }
    // } catch (e) {
      error = await this.parsers.ErrorHandler( errorM,d, true);
    // }
    return error;
  }

  static async getRole ( guild, id )
  { 
    let role = guild.roles.cache.get(id);
    if (!role) role = await this.fetchRole(guild, id);
    return role;
  }

  static async fetchRole ( guild, id )
  {
    return guild.roles.fetch(id, { force: true }).catch((err) => undefined);
  }

  static aoiFunc(d, FieldsRequired = true) {
    const data = {
      inside: d.unpack(),
      code: d.command.code,
      function: d.func,
    };
    if (FieldsRequired) {
      data.err = d.inside(data.inside);
    }
    return data;
  }

  static getEmoji(d, Emoji) {
    return d.client.emojis.cache.find(
      (x) =>
        x.name.toLowerCase() === Emoji.toLowerCase().addBrackets() ||
        x.id === Emoji ||
        x.toString() === Emoji,
    );
  }

  static getSticker(guild, Sticker) {
    return guild.stickers.cache.find(
      (x) =>
        x.name.toLowerCase() === Sticker.toLowerCase().addBrackets() ||
        x.id === Sticker,
    );
  }

  static async findId(d, id) {
    return (
      (await this.getGuild(d, id)) ||
      (await this.getUser(d, id)) ||
      (await this.getChannel(d, id, false)) ||
      (await this.getMessage(d.channel, id)) ||
      (await this.getRole(d.guild, id)) ||
      this.getEmoji(d, id) ||
      this.getSticker(d.guild, id) ||
      undefined
    );
  }

  /**
   * @param  {Discord.Guild} guild
   * @param  {string} memberResolver
   * @returns {string?}
   */
  static findMember(guild, memberResolver) {
    return guild.members.cache.findKey(
      (x) =>
        x.displayName.toLowerCase() === memberResolver.toLowerCase() ||
        x.user.username.toLowerCase() === memberResolver.toLowerCase() ||
        x.id === memberResolver ||
        x.toString() === memberResolver,
    );
  }

  /**
   * @param  {Discord.Guild} guild
   * @param  {string} ChannelResolver
   * @returns {string?}
   */
  static findGuildChannel(guild, ChannelResolver) {
    return guild.channels.cache.findKey(
      (x) =>
        x.name.toLowerCase() === ChannelResolver.toLowerCase() ||
        x.id === ChannelResolver ||
        x.toString() === ChannelResolver,
    );
  }

  /**
   * @param  {import('../classes/Bot.js')} client
   * @param  {string} ChannelResolver
   * @returns {string?}
   */
  static findChannel(client, ChannelResolver) {
    return client.channels.cache.findKey(
      (x) =>
        x.name.toLowerCase() === ChannelResolver.toLowerCase() ||
        x.id === ChannelResolver ||
        x.toString() === ChannelResolver,
    );
  }

  /**
   * @param  {Discord.Guild} guild
   * @param  {string} RoleResolver
   * @returns {string?}
   */
  static findRole(guild, RoleResolver) {
    return guild.roles.cache.findKey(
      (x) =>
        x.name.toLowerCase() === RoleResolver.toLowerCase() ||
        x.id === RoleResolver ||
        x.toString() === RoleResolver,
    );
  }

  /**
   * @param  {import("../classes/Bot.js")} client
   * @param  {string} UserResolver
   * @returns {string?}
   */
  static findUser(client, UserResolver) {
    return client.users.cache.findKey(
      (x) =>
        x.username.toLowerCase() === UserResolver.toLowerCase() ||
        x.tag.toLowerCase() === UserResolver.toLowerCase() ||
        x.id === UserResolver ||
        x.toString() === UserResolver,
    );
  }
  static findRoles(
    guild,
    options = { type: "startsWith", query: "", limit: 10 },
  ) {
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
      aresample: 48000,
    };
  },
  bassboost: (value) => {
    return {
      bass: `g=${value}`,
    };
  },
  "8d": () => {
    return {
      extrastereo: "",
      aecho: "1:1:40:0.5",
      apulsator: "hz=0.125",
      stereowiden: "",
    };
  },
  pitch: (value) => {
    return {
      asetrate: 48000 * value,
      atempo: 1 - Number(`${value}`.split(".")[1]),
      aresample: 48000,
    };
  },
  karaoke: (value) => {
    return {
      stereotools: `mlev=${0.015625 * value}`,
    };
  },
  slowed: (value) => {
    return {
      asetrate: 48000 * Math.abs(Math.ceil(value) - value),
      aresample: 48000,
    };
  },
  deep: (value) => {
    return {
      asetrate: 48000 * Math.abs(Math.ceil(value) - value),
      atempo: 2 - Math.abs(Math.ceil(value) - value),
      aresample: 48000,
    };
  },
};

module.exports = Util;