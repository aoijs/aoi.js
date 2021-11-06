module.exports = async d => {
  const data = d.util.openFunc(d)
  const [ id ] = data.inside.splits;
  const channel = id ? d.guild?.channels?.cache?.get(id)?.id : d.channel?.id;
  if(!channel) return d.aoiError.fnError(d, 'channel', { inside: data.inside });
  data.result = channel.manageable
  return {
      code : d.util.setCode( data )
   }
}
