const { SI_SYMBOL, FormatOptions } = require("../Constants.js");
const { setTimeout } = require("timers/promises");
const {
  Invite,
  CategoryChannel,
  Emoji,
  GuildEmoji,
  ReactionEmoji,
  VoiceState,
  Role,
} = require("discord.js");
module.exports = {
  /**
   * @param  {number} number
   * @param  {number} decimal
   */
  abbreviate(number, decimal) {
    const tier = Math.floor(Math.log10(Math.abs(number || 1)) / 3);
    if (tier === 0) return number;
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = number / scale;
    return scaled.toFixed(decimal) + suffix;
  },
  /**
   * @param  {number} time
   */
  async wait(time) {
    await setTimeout(time);
  },
  /**
   * @param  {CategoryChannel} category
   */
  categoryChannelsOption(category) {
    const cat = category.children;
    return {
      names: cat.map((x) => x.name),
      ids: cat.map((x) => x.id),
      mentions: cat.map((x) => x.toString()),
      count: cat.size,
      json: JSON.stringify({
        names: cat.map((x) => x.name),
        ids: cat.map((x) => x.id),
        mentions: cat.map((x) => x.toString()),
        count: cat.size,
      }),
    };
  },
  Channel(channel) {
    const data = Object.create(channel);
    Object.assign(data, channel);
    delete data.messages;
    delete data.permissionOverwrites;
    data.threads = channel.threads?.cache.size;
    data.parent = channel.parent?.name;
    data.mention = channel.toString();

    return data;
  },
  /**
   * @param  {import('../../classes/Bot.js')} client
   */
  Client(client) {
    const data = {
      prefix: Array.isArray(client.prefix)
        ? client.prefix.join(" , ")
        : client.prefix,
      variables: {
        name: client.variableManager.vars.join(" , "),
        json: client.variableManager.toJSON(),
        object: client.variableManager.cache.object(),
      },
      user: Object.assign(Object.create(client.user), client.user),
      application: Object.assign(
        Object.create(client.application),
        client.application,
      ),
    };
    //user property modification
    data.user.avatarUrl = client.user.displayAvatarURL();
    data.user.displayAvatarURL = undefined;
    data.user.avatarURL = undefined;
    data.user.toJSON = undefined;
    data.user.flags = client.user.flags?.toArray().length
      ? client.user.flags?.toArray().join(" , ")
      : "none";
    data.presence = client.status;
    delete data.user.dmChannel;
    delete data.user.client;
    //application data modification
    data.application.iconURL = client.application.iconURL();
    data.application.flags = client.application.flags?.toArray().join(" , ");
    data.application.commands = undefined;
    data.application.client = undefined;
    data.json = JSON.stringify(Object.assign({}, data), null, 2);
    return data;
  },
  /**
   * @param  {GuildEmoji | ReactionEmoji } emoji
   */
  Emoji(emoji) {
    const data = Object.assign({}, emoji);
    //emoji data modification
    data.setName = undefined;
    data.delete = undefined;
    data.edit = undefined;
    data.equals = undefined;
    data.fetchAuthor = undefined;

    data.string = emoji.toString();
    data.json = JSON.stringify(data, null, 2);
    data.guild = emoji.guild?.id;
    data.roles = emoji.roles?.cache.map((x) => x.id).join(" , ");

    data.toJSON = undefined;
    return data;
  },
  EmbedData(embed, embeds) {
    const data = {
      authorname: embed.author?.name,
      authoricon: embed.author?.iconURL,
      authorurl: embed.author?.url,
      image: embed.image?.url,
      thumbnail: embed.thumbnail?.url,
      color: embed.color,
      footertext: embed.footer?.text,
      footericon: embed.footer?.iconURL,
      description: embed.description,
      title: embed.title,
      url: embed?.url,
    };

    embed.fields.forEach((x, y) => (data[`field${y + 1}`] = x));

    data.json = JSON.stringify(data, null, 2);
    data.rawjson = embed.toJSON();
    data.allEmbeds = JSON.stringify(embeds, null, 2);

    return data;
  },
  /**
   * @param  {Invite} invite
   */
  Invite(invite) {
    const data = Object.assign({}, invite);

    data.delete = undefined;
    data.guild = undefined;
    data.channel = undefined;
    data.inviter = undefined;

    data.channelname = invite.channel?.name;
    data.channelid = invite.channel?.id;
    data.channelmention = invite.channel?.toString();

    data.guildname = invite.guild?.name;
    data.guildid = invite.guild?.id;
    data.guildmention = invite.guild?.toString();

    data.invitername = invite.inviter?.username;
    data.inviterdiscm = invite.inviter?.discriminator;
    data.invitertag = invite.inviter?.tag;
    data.inviterid = invite.inviter?.id;
    data.invitermention = invite.inviter?.toString();

    data.createdAt = invite.createdAt;
    data.createdTimestamp = invite.createdTimestamp;

    data.expiresAt = invite.expiresAt;
    data.expiresTimestamp = invite.expiresTimestamp;

    data.toString = data.toString();
    data.json = JSON.stringify(data, null, 2);

    return data;
  },
  Guild(guild) {
    const data = Object.assign({}, guild);
    //modifying data
    data.afkChannel = guild.afkChannel?.name;
    data.bannerURL = guild.bannerURL();
  },
  Webhook(webhook) {
    const data = Object.assign(Object.create(webhook), webhook);

    data.send = undefined;
    data.sendSlackMessage = undefined;
    data.avatarURL = webhook.avatarURL({ dynamic: true, size: 4096 });
    data.sourceChannel = undefined;
    data.sourceGuild = undefined;
    data.owner = webhook.owner?.id;
    data.client = undefined;
    data.delete = undefined;
    data.deleteMessag = undefined;
    data.edit = undefined;
    data.editMessage = undefined;
    data.fetchMessage = undefined;
    data.isChannelFollower = webhook.isChannelFollower();
    data.isIncoming = webhook.isIncoming();

    return data;
  },
  Message(msg) {
    const data = Object.assign({}, msg);
    data.activityPartyId = msg.activity?.partyId;
    data.activityType = msg.activity?.type;
    data.activity = undefined;

    data.attachments = msg.attachments.map((x) => x.url);

    data.authorName = msg.author.username;
    data.authorId = msg.author.id;
    data.authorIcon = msg.author.avatarURL({ size: 4096, dynamic: true });
    data.authorMention = msg.author.toString();
    data.author = undefined;

    data.channelName = msg.channel.name;
    data.channelType = msg.channel.type;
    data.channelMention = msg.channel.toString();
    data.channel = undefined;

    data.client = undefined;

    data.components = JSON.stringify(msg.components, null, 2);

    data.cleanContent = msg.cleanContent;
    data.createdAt = msg.createdAt;

    data.deleted = msg.deleted;
    data.deletable = msg.deletable;

    data.crosspostable = msg.crosspostable;
    data.editable = msg.editable;

    data.editedAt = msg.editedAt;
    data.embeds = JSON.stringify(msg.embeds, null, 2);

    data.groupActivityApplication = undefined;

    data.guildname = msg.guild.name;
    data.guildicon = msg.guild.iconURL({ size: 4096, dynamic: true });
    data.guild = undefined;

    data.hasThread = msg.hasThread;
    data.member = undefined;

    data.pinnable = msg.pinnable;

    return data;
  },
  /**
   * @param  {Role} role
   */
  Role(role) {
    const data = Object.assign({}, role);
    //modifying data
    data.createdAt = role.createdAt;
    data.createdTimestamp = role.createdTimestamp;

    data.hexColor = role.hexColor;

    data.members = role.members.map((x) => x.id).join(" , ");
    data.memberCount = role.members.size;

    data.position = role.position;
    data.permissions = role.permissions.toArray().join(" , ");
    data.tagsbotid = role.tags?.botId;
    data.tagsapplicationid = role.tags?.applicationId;
    data.tagspremiumSubscriberRole = role.tags?.premiumSubscriberRole;

    return data;
  },

  /**
   * @param  {VoiceState} state
   */
  VoiceState(state) {
    const data = Object.assign({}, state);

    data.deaf = state.deaf;
    data.mute = state.mute;
    data.guild = undefined;
    data.guildId = state.guild.id;

    return data;
  },
  User(user) {
    const data = Object.assign({}, user);

    data.accentColor = user.accentColor;
    data.banner = user.banner;
    data.bannerURL = user.bannerURL();
    data.createdAt = user.createdAt;
    data.createdTimestamp = user.createdTimestamp;
    data.avatarURL = user.avatarURL({ size: 4096, dynamic: true });
    data.flags = user.flags?.toArray().join(" , ");
    data.partial = user.partial;
    data.tag = user.tag;
    data.dmChannel = user.dmChannel?.id;

    return data;
  },
  Presence(presence) {
    const data = Object.assign({}, presence || { status: "offline" });

    data.activities = JSON.stringify(presence?.activities, null, 2);
    data.webStatus = presence?.clientStatus?.web;
    data.desktopStatus = presence?.clientStatus.desktop;
    data.mobileStatus = presence?.clientStatus.mobile;
    data.guildId = presence?.guild.id;

    data.authorId = presence?.userId;
    data.user = undefined;
    data.guild = undefined;

    return data;
  },
  RBGtoHex(r, b, g) {
    return "#" + this.PartToHex(r) + this.PartToHex(b) + this.PartToHex(g);
  },
  PartToHex(d) {
    const data = d.toString(16);
    return data.length === 1 ? "0" + data : data;
  },
  FormatDate(date, format) {
    ////Map for Storing Each Format
    const FormatMap = new Map();

    ////creating Array of format
    format = format.split(" ");

    ////finding and setting indexes per format
    // Map<Key,Value> -> Map<format,Array<index>>
    format.forEach((x, y) => {
      if (!FormatMap.has(x)) FormatMap.set(x, [y]);
      else {
        const arr = FormatMap.get(x);
        arr.push(y);
        FormatMap.set(x, arr);
      }
    });

    ////basic defining
    let i = format.length - 1;
  },
  Timeout(d, name, duration, timeoutData, pulse) {
    timeoutData.__duration__ = Date.now() + duration;
    timeoutData.__timeoutName__ = name;
    timeoutData.__pulseEvery__ = pulse;
    timeoutData.__id__ = Math.floor(Math.random() * 999999);

    d.client.db.set(
      d.client.db.tables[0],
      "setTimeout",
      timeoutData.__id__,
      timeoutData,
    );

    if (!pulse) {
      require("../../handler/custom/timeout.js")(
        d,
        name,
        duration,
        timeoutData,
        false,
      );
    } else {
      require("../../handler/custom/timeoutPulse.js")(
        d,
        name,
        duration,
        pulse,
        timeoutData,
        false,
      );
    }
  },
};
