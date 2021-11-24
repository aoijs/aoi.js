module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();

    const [userId = d.author.id, channelId = d.channel.id, sep = " , "] =
        inside.splits;

    const member = await d.util.getMember(d.guild, userId);
    if (!member) return d.aoiError.fnError(d, "member", {inside});

    const channel = await d.util.getChannel(d, channelId);
    if (!channel) return d.aoiError.fnError(d, "channel", {inside});

    const result = member.permissionsIn(channelId)?.toArray().join(sep);

    return {
        code: d.util.setCode({function: d.func, code, inside, result}),
    };
};
