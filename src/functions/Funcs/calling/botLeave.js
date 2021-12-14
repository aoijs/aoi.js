module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const [guildId = d.guild?.id] = inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside});

    guild.leave().catch((_err) => {
        d.aoiError.fnError(
            d,
            "custom",
            {},
            "Failed To Leave The Guild With Reason" + _err,
        );
    });

    return {
        code: d.util.setCode({function: d.func, code, inside}),
    };
};
