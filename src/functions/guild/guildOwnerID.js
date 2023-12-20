module.exports = async d => {
    const data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    data.result = guild.ownerId ? guild.ownerId : (await guild.fetchOwner())?.id;

    return {
        code: d.util.setCode(data)
    }
}