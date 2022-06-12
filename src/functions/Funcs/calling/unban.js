module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [guildID = d.guild?.id, userID] = inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: inside});

    guild.members.unban(userID).catch((err) => {
        d.aoiError.fnError(
            d,
            "custom",
            {},
            `Failed To Unban ${userID} With Reason: ` + err,
        );
    });

    return {
        code: d.util.setCode({function: d.func, code, inside}),
    };
};
