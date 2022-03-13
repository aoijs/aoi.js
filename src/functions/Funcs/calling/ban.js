module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    let [userId, guildId = d.guild?.id, days = "7", reason] = inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: inside});

    days = Number(days);
    if (isNaN(days) || days > 7 || days < 0)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside},
            "Invalid Day Provided In",
        );

    guild.members.ban(userId, {days, reason:reason.addBrackets()}).catch((error) => {
        d.aoiError.fnError(
            d,
            "custom",
            {},
            "Failed To Ban The User With Id: " + userId + " ,Reason: " + error,
        );
    });
    return {
        code: d.util.setCode({function: d.func, code, inside}),
    };
};
