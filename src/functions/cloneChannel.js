/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [channelID = d.channel.id, name, returnID = "false"] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

    let result = await channel.clone({name}).catch(err => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Clone Channel With Reason: " + err);
    });

    data.result = returnID === "true" ? result?.id : undefined;

    return {
        code: d.util.setCode(data)
    }
}
    