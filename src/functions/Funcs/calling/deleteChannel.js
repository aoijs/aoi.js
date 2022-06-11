module.exports = async d => {
    const {code, inside, err} = d.util.aoiFunc(d);
    if (err) return d.error(err);

    let [channel] = inside.splits;
    channel = await d.util.getChannel(d, channel);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    channel.delete().catch(e => {
        d.aoiError.fnError(d, "custom", {}, "Failed To Delete Channel: " + channel.name + " With Reason: " + e);
    });

    return {
        code: d.util.setCode({function: d.func, code, inside})
    }
}