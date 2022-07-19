module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [guildID, userId, mute = 'yes', reason] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, 'guild', {inside: data.inside});

    const member = await d.util.getMember(guild, userId);
    if (!member) return d.aoiError.fnError(d, 'member', {inside: data.inside});

    const state = guild.voiceStates.cache.get(member.id);
    if (!state?.channel) return d.aoiError.fnError(d, 'custom', {}, 'User Is Not In Any Voice/Stage Channel.');

    state.setMute(mute === 'yes', reason?.addBrackets()).catch(e => {
        d.aoiError.fnError(d, 'custom', {}, 'Failed To Move User With Reason: ' + e);
    });

    return {
        code: d.util.setCode(data)
    }
}