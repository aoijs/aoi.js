module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [guildID = d.guild?.id, id = d.author?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    let u = await d.util.getMember(guild, id)
    if (!u) return d.aoiError.fnError(d, "member", {inside: data.inside})

    data.result = u.presence?.activities?.join(", ")?.deleteBrackets() || "none"
    return {
        code: d.util.setCode(data)
    }
};