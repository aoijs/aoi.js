module.exports = async d => {
    const data = d.util.aoiFunc(d);

    let [guildID = d.guild?.id, userID = d.author.id, format = "ms"] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID)
    if (d.channel.type !== d.util.channelTypes.DM && !guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    const user = !guild ? true : await d.util.getMember(guild, userID);
    if (!user) return d.aoiError.fnError(d, "user", {inside: data.inside});

    data.result = (user === true ?
            0 :
            (format === "date" ?
                user.premiumSince :
                user.premiumSinceTimestamp)
    ) ?? 0;

    return {
        code: d.util.setCode(data)
    }
}