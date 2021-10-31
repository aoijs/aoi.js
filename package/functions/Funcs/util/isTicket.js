module.exports = async d => {
    const data = d.util.openFunc( d );
    
    const [ ticketId,guildId = d.guild?.id ] = data.inside.splits;

    const guild = d.util.getGuild( d,guildId );
    if( !guild ) return d.aoiError.fnError( d,'guild',{ inside : data.inside });

    data.result = await d.client.db.get( d.client.db.tables[0],'ticket',ticketId );

    return {
        code : d.util.setCode( data )
    }
}