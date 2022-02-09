module.exports = async d => {
    const {code} = d.command;
    const inside = d.unpack();
    let [guildId = d.guild?.id, userId = d.author.id, format = "ms"] = inside.splits;

    const guild = await d.util.getGuild(d, guildId)
    if (d.channel.type !== d.util.channelTypes.Dm && !guild) return d.aoiError.fnError(d, "guild", {inside});

    const user = !guild ? true : await d.util.getMember(guild, userId);
    if (!user) return d.aoiError.fnError(d, "user", {inside});

    const result = (user === true ?
            0 :
            (format === "date" ?
                user.premiumSince :
                user.premiumSinceTimestamp)
    ) ?? 0;

    return {
        code: d.util.setCode({function: d.func, code, inside, result})
    }
}