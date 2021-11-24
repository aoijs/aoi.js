module.exports = async (d) => {
    const code = d.command.code;
    const inside = d.unpack()
    const [id = d.author?.id, guildId = d.guild?.id] = inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: DataTransfer.inside});

    let u = await d.util.getMember(guild, id)
    if (!u) return d.aoiError.fnError(d, "member", {inside})
    return {
        code: d.util.setCode({
            function: d.func,
            code,
            inside,
            result: u.presence?.activities?.join(", ")?.deleteBrackets() || "none"
        })
    }
};