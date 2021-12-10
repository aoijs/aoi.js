module.exports = async (d) => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    let [roleResolver, guildId = d.guild.id] = data.inside.splits;
    roleResolver = roleResolver.addBrackets();

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, "guild", {inside: data.inside});

    data.result = d.util.findRole(guild, roleResolver);

    return {
        code: d.util.setCode(data),
    };
};
