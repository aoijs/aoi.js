module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID = d.guild?.id, code, reason] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    await guild.invites
        .delete(code.addBrackets(), reason?.addBrackets())
        .catch((e) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Failed To Delete Invite: " + code + " With Reason: " + e,
            );
        });

    return {
        code: d.util.setCode(data),
    };
};