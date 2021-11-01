module.exports = async d => {
    const data = d.util.setCode( d );
    if( data.err ) return d.error( data.err );
    
    const [ name , type = 'global' ] = data.inside.splits;
    
    data.result = d.client.application.commands.find( x => x.name.toLowerCase() === name.toLowerCase() && type === 'global' ? true : x.guildId === type  )?.id
    
    return {
        code : d.util.setCode( data )
    }
}