module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [msg, ...channelIds] = data.inside.splits;

    msg = await d.util.errorParser(msg, d);

    for (const x of channelIds) {
        const channel = await d.util.getChannel(d, x);

        if (channel) {
            await d.aoiError.makeMessageError(d.client, channel, msg, msg.options, d);
        }
    }

    return {
        code: d.util.setCode(data)
    }
}