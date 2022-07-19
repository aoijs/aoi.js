module.exports = async (d) => {
    const {code} = d.command;
    const inside = d.unpack();
    const [guildID = d.guild.Id, returnCount = "no"] = inside.splits;
    let result;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside});

    if (guild.memberCount > guild.members.cache.size) {
        result = await guild.members.fetch().catch((err) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Failed To Fetch Members With Reason :" + err,
            );
        });
    }

    return {
        code: d.util.setCode({function: d.func, code, inside, result}),
    };
};
