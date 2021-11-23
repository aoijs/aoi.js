module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();

    const [channelId = d.channel?.id] = inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    return {
        code: d.util.setCode({function: d.func, code, inside, result: channel.name})
    }
}