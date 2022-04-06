module.exports = async (d) => {
    const data = d.util.openFunc(d);
    const [id = d.author?.id, guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: DataTransfer.inside});

    let u = await d.util.getMember(guild, id)
    if (!u) return d.aoiError.fnError(d, "member", {inside: data.inside})

    data.result =  u.presence?.activities?.join(", ")?.deleteBrackets() || "none"

    return {
        code: d.util.setCode(data)
    }
};