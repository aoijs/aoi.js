module.exports = async d => {
    const data = d.util.openFunc(d);

    const [guildId = d.guild?.id, option = 'id'] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    data.result = option === "mention" ? guild.roles.highest.toString() : guild.roles.highest[option];

    return {
        code: d.util.setCode(data)
    }
}