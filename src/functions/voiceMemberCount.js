/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [channelID = d.member?.voice?.channelId] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);

    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    if (![d.util.channelTypes.Voice, d.util.channelTypes.Stage].includes(channel.type)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Channel Type Is Not Voice/Stage");

    data.result = channel.members.size ?? 0;

    return {
        code: d.util.setCode(data)
    };
};
