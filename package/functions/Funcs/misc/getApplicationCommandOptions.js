module.exports = async d => {
    const data = d.util.setCode( d );
    if( data.err ) return d.error( data.err );
    
    const [ name , type = 'global' ] = data.inside.splits;
    
    data.result = JSON.stringify( d.client.application.commands.find( x => x.name.toLowerCase() === name.toLowerCase() && type === 'global' ? true : x.guildId === type  )?.Options,null,2 );
    
    return {
        code : d.util.setCode( data )
    }
}