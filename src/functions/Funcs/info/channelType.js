module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [channelID = d.channel.id] = data.inside.splits;

    const channel = await d.util.getChannel(d, channelID);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside: data.inside});
    const types = Object.entries(d.util.channelTypes);

    data.result = types.find(x => x[1] === channel.type)?.[0]?.toLowerCase();

    return {
        code: d.util.setCode(data)
    }
}