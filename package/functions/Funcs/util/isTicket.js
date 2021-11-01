module.exports = async d => {
    const data = d.util.openFunc( d );
    
    const [ ticketId ] = data.inside.splits;
    data.result = await d.client.db.get( d.client.db.tables[0],'ticket',ticketId );

    return {
        code : d.util.setCode( data )
    }
}