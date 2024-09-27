/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    let [guildID = d.guild?.id, channel] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    channel = guild.channels.cache.find(x => x.name.toLowerCase() === channel.toLowerCase().addBrackets() || x.id === channel)

    data.result = !!channel

    return {
        code: d.util.setCode(data)
    }
}