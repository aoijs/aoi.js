module.exports = async d => {
    const data = d.util.openFunc( d );
    if( data.err ) return d.error( data.err );
    const [ userId = d.member?.id, guildId = d.guild?.id ] = data.inside.splits;
    const guild = d.util.getGuild(d,guildId);
    if(!guild) return d.aoiError.fnError( d,'guild',{ inside : data.inside });
    const user = guild.members?.cache?.get(userId)
    if(!user) return d.aoiError.fnError( d,'user',{ inside : data.inside });
    data.result = user.voice.selfVideo
    return {
        code: d.util.setCode(data)
    }
}
//Usage `$isVideoOn[user's id(optional); server's id(optional)]`
