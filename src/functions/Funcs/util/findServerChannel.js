module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [channelResolver, returnSelf = "yes", guildID = d.guild.id] =
        data.inside.splits;
    channelResolver = channelResolver.addBrackets();

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    data.result = d.util.findGuildChannel(guild, channelResolver) || (returnSelf === "yes" ? d.channel.id : undefined);

    return {
        code: d.util.setCode(data),
    };
};
