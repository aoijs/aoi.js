module.exports = d => {
    let {code, result, inside} = d.util.openFunc(d);
    const [guildId = d.guild?.id] = inside.splits;

    const guild = d.util.getGuild(d, guildId);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside});

    result = guild.roles.cache.random()?.id;
    if (!d.randoms[`randomRole_${guild.id}`]) {
        d.randoms[`randomRole_${guild.id}`] = result
    } else {
        result = d.randoms[`randomRole_${guild.id}`];
    }

    return {
        code: d.util.setCode({function: d.func, code, result, inside})
    }
}