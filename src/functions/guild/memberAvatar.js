/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, userID = d.author?.id, size = 4096, dynamic = "true", extension] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside})

    const user = userID === d.author?.id ? d.member : await d.util.getMember(guild, userID);
    if (!user) return d.aoiError.fnError(d, "member", {inside: data.inside});

    data.result = user.avatarURL({
        size: Number(size),
        forceStatic: dynamic === "false",
        extension,
    });

    return {
        code: d.util.setCode(data),
    };
};
