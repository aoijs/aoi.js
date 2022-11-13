const BulkOptions = (d) => {
    return {
        messages: d.data.bulk.map((x) => x.content).join(" , "),
        ids: d.data.bulk.map((x) => x.id).join(" , "),
        createdTimestamp: d.data.bulk.map((x) => x.createdTimestamp).join(" , "),
        createdAt: d.data.bulk.map((x) => x.createdAt).join(" , "),
        userIds: d.data.bulk.map((x) => x.author.id).join(" , "),
        usernames: d.data.bulk.map((x) => x.author.username).join(" , "),
        userTags: d.data.bulk.map((x) => x.author.tag).join(" , "),
        userMentions: d.data.bulk.map((x) => x.author.toString()).join(" , "),
        guildId: d.data.bulk.first().guildId,
        guildName: d.data.bulk.first().guild.name,
        channelID: d.data.bulk.first().channelID,
        channelName: d.data.bulk.first().channel.name,
    };
};

const BulkData = (d, option) => {
    return BulkOptions(d)[option];
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
