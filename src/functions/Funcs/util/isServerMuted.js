module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [guildID = d.guild?.id, userID = d.member?.id] = data.inside.splits;
    
    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});
    const user = await d.util.getMember(guild, userID)
    if (!user) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    data.result = user.voice.serverMute
    return {
        code: d.util.setCode(data)
    }
}