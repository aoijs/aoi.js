const { MessageFlags } = require("discord.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelId, messageId, ...flags] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });

    message.edit({ flags: flags.map((x) => MessageFlags[x.trim()]) }).catch((err) => {
        return d.aoiError.fnError(d, "custom", {}, "Failed To Add Message Flags With Reason: " + err);
    });

    return {
        code: d.util.setCode(data)
    };
};
