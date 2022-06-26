module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();

    const [uorrId = d.author.id, channelId = d.channel.id, sep = " , "] =
        inside.splits;

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    const result = channel.permissionsFor(uorrId)?.toArray().join(sep);

    return {
        code: d.util.setCode({function: d.func, code, inside, result}),
    };
};
