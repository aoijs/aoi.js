/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [guildID = d.guild?.id, fetchFirst = 'false'] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    if (fetchFirst == 'true') await guild.fetchVanityData().catch(Boolean);
    data.result = guild.vanityURLCode ? `discord.gg/${guild.vanityURLCode}` : 'undefined';

    return {
        code: d.util.setCode(data)
    }
}
