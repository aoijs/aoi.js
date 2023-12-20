module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', { inside: data.inside });

    const autoModRules = await guild.autoModerationRules.fetch();
    const autoModNames = autoModRules.map((rule) => rule.name);

    const spacedNames = autoModNames.join(", ");

    data.result = spacedNames;

    return {
        code: d.util.setCode(data)
    };
};
