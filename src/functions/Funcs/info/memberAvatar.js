module.exports = async (d) => {
    const data = d.util.openFunc(d);

    const [
        guildId = d.guild?.id,
        userId = d.author?.id,
        size = 4096,
        dynamic = "yes",
        format,
    ] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside})

    const user =
        userId === d.author?.id ? d.member : await d.util.getMember(guild, userId);
    if (!user) return d.aoiError.fnError(d, "member", {inside: data.inside});

    data.result = user.displayAvatarURL({
        size: Number(size),
        dynamic: dynamic === "yes",
        format,
    });

    return {
        code: d.util.setCode(data),
    };
};
