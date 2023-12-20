const BulkOptions = (d, sep) => {
    return {
        messages: d.data.bulk.map((x) => x.content).join(sep),
        ids: d.data.bulk.map((x) => x.id).join(sep),
        createdTimestamp: d.data.bulk.map((x) => x.createdTimestamp).join(sep),
        createdAt: d.data.bulk.map((x) => x.createdAt).join(sep),
        userIds: d.data.bulk.map((x) => x.author.id).join(sep),
        usernames: d.data.bulk.map((x) => x.author.username).join(sep),
        userTags: d.data.bulk.map((x) => x.author.tag).join(sep),
        userMentions: d.data.bulk.map((x) => x.author.toString()).join(sep),
        guildId: d.data.bulk.first().guild.id,
        guildName: d.data.bulk.first().guild.name,
        channelID: d.data.bulk.first().channel.id,
        channelName: d.data.bulk.first().channel.name,
    };
};

const BulkData = (d, sep, option) => {
    return BulkOptions(d, sep)[option];
};

const PinData = (d) => {
    const data = {
        time: d.data.time,
        channelID: d.data.channel.id,
        channelName: d.data.channel.name,
        channelMention: d.data.channel.toString(),
        guildId: d.data.guild.id,
        guildName: d.data.guild.name,
        messageID: d.data.channel.messages.last()?.id,
        messageContent: d.data.channel.messages.last()?.content,
    };
};
const RateLimitOptions = [
    "timeout",
    "limit", //.limit",
    "method", // "Method used to this endpoint;.method",
    "path", // "The path to the api endpoint that triggered the rate limit;.path",
    "route", // "The route that triggered this event;.route",
];
const WebhookUpdateOptions = [
    "id", //"id",
    "name", // "name.deleteBrackets()",
    "type", // "The type of the channel where the pins were updated;.type",
    "guildid", // "The guild's ID of the channel where the webhook was updated;.guild.id",
];

module.exports = {
    BulkData,
    PinData,
    RateLimitOptions,
    WebhookUpdateOptions,
};
