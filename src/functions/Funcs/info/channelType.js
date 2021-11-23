module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();

    const [channelId = d.channel.id] = inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});
    const types = Object.entries(d.util.channelTypes);

    const result = types.find(x => x[1] === channel.type)?.[0]?.toLowerCase();

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}