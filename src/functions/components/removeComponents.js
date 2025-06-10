/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [channelId = d.channel?.id, messageId = d.message?.id, ...customIds] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    const message = await d.util.getMessage(channel, messageId);
    if (!message) return d.aoiError.fnError(d, "message", { inside: data.inside });

    if (customIds.includes("all")) {
        message.components = [];
    } else {
        customIds.forEach((x) => {
            message.components.forEach((actionRow) => {
                actionRow.components = actionRow.components.filter((component) => component.customId !== x);
            });
        });

        message.components = message.components.filter((actionRow) => actionRow.components.length > 0);
    }

    message.edit({ components: message.components });

    return {
        code: d.util.setCode(data)
    };
};
