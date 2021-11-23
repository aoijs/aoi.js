module.exports = async d => {
    const data = d.util.openFunc(d);

    const [channelId, option = 'id', sep = ' , '] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelId, true);
    if (!channel) return d.aoiError.fnError(d, 'channel', {inside: data.inside});
    if (!['voice', 'stage'].includes(d.util.channelTypes[channel.type])) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Channel Type Is Not Voice/Stage');

    data.result = channel.members.map(x => option === "mention" ? x.toString() : x[option]).join(sep)

    return {
        code: d.util.setCode(data)
    }
}