module.exports = async d => {
    let data = d.util.aoiFunc(d);

    const [guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    data.result = guild.maximumMembers;

    return {
        code: d.util.setCode(data)
    }
}