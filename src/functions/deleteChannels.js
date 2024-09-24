/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [...channels] = data.inside.splits;
    const wrongChannels = [];
    const chans = [];

    await channels.forEach(async x => {
        const c = await d.util.getChannel(d, x);
        if (!c) wrongChannels.push(x);
        else chans.push(c);
    });

    if (wrongChannels.length) return d.aoiError.fnError(d, "custom", { inside: data.inside}, `Invalid Channels : ${wrongChannels.join(" , ")} Provided In`);
    for (let i = chans.length - 1; i >= 0; i--) {
        chans[i].delete().catch(e => {
            d.aoiError.fnError(d, "custom", {}, "Failed To Delete Channel: " + chans[i].name + " With Reason: " + e);
        });
    }

    return {
        code: d.util.setCode(data)
    }
}