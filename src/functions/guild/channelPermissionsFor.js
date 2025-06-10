/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [uorrId = d.author.id, channelID = d.channel.id, sep = " , "] =
        data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});

    data.result = channel.permissionsFor(uorrId)?.toArray().join(sep);

    return {
        code: d.util.setCode(data),
    };
};
