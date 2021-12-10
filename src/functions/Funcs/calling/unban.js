module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [userId, guildId = d.guild?.id] = inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: inside});

    guild.members.unban(userId).catch((err) => {
        d.aoiError.fnError(
            d,
            "custom",
            {},
            `Failed To Unban ${userId} With Reason: ` + err,
        );
    });

    return {
        code: d.util.setCode({function: d.func, code, inside}),
    };
};
