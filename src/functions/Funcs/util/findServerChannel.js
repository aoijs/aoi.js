module.exports = async (d) => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [channelResolver, returnSelf = "yes", guildId = d.guild.id] =
        data.inside.splits;
    channelResolver = channelResolver.addBrackets();

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    data.result = d.util.findGuildChannel(guild, channelResolver) || (returnSelf === "yes" ? d.channel.id : undefined);

    return {
        code: d.util.setCode(data),
    };
};
