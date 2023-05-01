module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID, ...roles] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});
    const wrongRoles = [];
    const ros = [];

    roles.forEach((x) => {
        if (
            !guild.roles.cache.find(
                (y) =>
                    y.name.toLowerCase() === x.toLowerCase().addBrackets() || y.id === x,
            )
        )
            wrongRoles.push(x);
        else
            ros.push(
                guild.roles.cache.find(
                    (y) =>
                        y.name.toLowerCase() === x.toLowerCase().addBrackets() ||
                        y.id === x,
                ),
            );    });
    if (wrongRoles.length)
        return d.aoiError.fnError(
            d,
            "custom",
            {inside},
            `Invalid Roles : ${wrongRoles.join(" , ")} Provided In`,
        );

    for (let i = ros.length - 1; i >= 0; i--) {
        ros[i].delete().catch((e) => {
            d.aoiError.fnError(
                d,
                "custom",
                {},
                "Failed To Delete Roles: " + ros[i].name + " With Reason: " + e,
            );
        });
    }

    return {
        code: d.util.setCode(data),
    };
};
