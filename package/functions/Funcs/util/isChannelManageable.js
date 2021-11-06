module.exports = async d => {
  const data = d.util.openFunc(d)
  if( data.err ) return d.error( data.err );
  const [ channelId = d.channel?.id, guildId = d.guild?.id ] = data.inside.splits;
  const guild = d.util.getGuild(d,guildId);
  if(!guild) return d.aoiError.fnError( d,'guild',{ inside : data.inside });
  const channel = guild.channels?.cache?.get(channelId)?.id
  if(!channel) return d.aoiError.fnError(d, 'channel', { inside: data.inside });
  data.result = channel.manageable
  return {
      code : d.util.setCode( data )
   }
}
//Usage: $isChannelManageable[channel id(optional); guild id(optional)]
