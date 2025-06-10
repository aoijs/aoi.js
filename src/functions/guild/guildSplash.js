/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id, size = 4096, dynamic = 'true', extension] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    data.result = guild.splashURL({
        size: Number(size),
        forceStatic: dynamic === 'false',
        extension
    });

    return {
        code: d.util.setCode(data)
    }
}
