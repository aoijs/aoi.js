const { EmbedBuilder } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [index = 1, messageId = d.message.id, channelId = d.message.channel.id] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    const message = await d.util.getMessage(channel, messageId);

    const embeds = message?.embeds.map((embed) => EmbedBuilder.from(embed.toJSON()));

    if (!embeds.length) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "The provided message has no embeds to clone");
    if (!d.embeds) d.embeds = [];

    if (index === "all") {
        d.embeds.push(...embeds);
    } else {
        d.embeds.push(embeds[index - 1]);
    }

    d.embeds = d.embeds.filter((embed) => embed);

    return {
        code: d.util.setCode(data),
        embeds: d.embeds
    };
};
