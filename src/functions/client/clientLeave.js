module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    data.result = guild.leave().catch((_err) => {
        d.aoiError.fnError(
            d,
            "custom",
            {},
            "Failed To Leave The Guild With Reason" + _err,
        );
    });

    return {
        code: d.util.setCode(data),
    };
};
