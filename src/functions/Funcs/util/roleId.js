module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [roleResolver, guildId = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const role = guild.roles.cache.find(x => x.id === roleResolver || x.name.toLowerCase() === roleResolver.addBrackets().toLowerCase());
    if (!role) return d.aoiError.fnError(d, 'role', {inside: data.inside});
    data.result = role?.id

    return {
        code: d.util.setCode(data)
    }
}