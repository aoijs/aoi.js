module.exports = async d => {
  const data = d.util.openFunc(d)
  if( data.err ) return d.error( data.err );

  const [ id ] = data.inside.splits;
  const role = id ? d.guild?.roles?.cache?.get(id)?.id;
  if(!role) return d.aoiError.fnError(d, 'role', { inside: data.inside });
  data.result = role.editable
  return {
      code : d.util.setCode( data )
   }
}
