/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, fetchFirst = 'false'] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    if (fetchFirst === 'true') {
        guild.roles.fetch();
    }

    data.result = guild.roles.cache.size;

    return {
        code: d.util.setCode(data)
    }
}