/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channel] = data.inside.splits;
    channel = await d.util.getChannel(d, channel);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    channel.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Channel: " + channel.name + " With Reason: " + e);
    });

    return {
        code: d.util.setCode(data)
    }
}