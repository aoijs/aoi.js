const { AoijsAPI, DbdTsDb, AoiMongoDb, CustomDb } = require( "../../../classes/Database.js" );

module.exports = async ( d ) =>
{ 
    const data = d.util.aoiFunc( d );
    if ( data.err ) return d.error( data.err );

    const [ variable, id, type, options, table = d.client.db.tables[ 0 ] ] = data.inside.splits;
    
    const all = await d.client.db.all( table, variable.addBrackets(), 1 );

    let key;
    if ( d.client.db instanceof AoijsAPI || d.client.db instanceof AoiMongoDb )
    {
        key = `${ variable.addBrackets() }_${ ( type === 'user' ? `${ id }_${ d.guild?.id ?? "dm" }` : id ) }`;
    } else if ( d.client.db instanceof DbdTsDb )
    {
        key = `${ ( type === 'user' ? `${ id }_${ d.guild?.id ?? "dm" }` : id ) }`;
    } 

    const top = all.findIndex( x =>
    {
        if ( d.client.db instanceof DbdTsDb ) return x.id === key;
        else return x.key === key;
    } );
    let value = all[ top ];
    value = value?.value ?? value?.data?.value ?? value?.Data?.value ?? value?.Data ?? 0;

    const Data =
        type === "server"
            ? d.client.guilds.cache.get(id) || {}
            : await d.client.users.fetch(id);

    data.result = type === 'top' ? top + 1 : type === 'value' ? value : type === 'server' ? Data.name : Data.tag;

    return {
        code: d.util.setCode( data ),
    };
};
