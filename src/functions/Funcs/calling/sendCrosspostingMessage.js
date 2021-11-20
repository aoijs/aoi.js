module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [msg, ...channelIds] = data.inside.splits;

    msg = await d.util.errorParser(msg, d);

    channelIds.forEach(x => {
        const channel = d.util.getChannel(d, x);

        if (channel) {
            d.aoiError.makeMessageError(d.client, channel, msg, msg.options,d);
        }
    });

    return {
        code: d.util.setCode(data)
    }
}