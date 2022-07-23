const Interpreter = require( "../../../interpreter.js" );
module.exports = async d =>
{
    const data = d.util.aoiFunc( d );
    if ( data.err ) return d.error( data.err );

    const [ name, awaitedCmd, awaitData = '{}' ] = data.inside.splits;

    if ( !d.data.arrays[ name ] )
    {
        return d.aoiError.fnError( d, "custom", { inside: data.inside }, "Array With Name '" + name + "' Does Not Exist." );
    }

    let cmd = d.client.cmd.awaited.find( c => c.name.toLowerCase() === awaitedCmd.toLowerCase() );

    if ( !cmd )
    {
        return d.aoiError.fnError( d, "custom", { inside: data.inside }, "Awaited Command With Name '" + awaitedCmd + "' Does Not Exist." );
    }
    let parsedData;
    try
    {
        parsedData = JSON.parse( awaitData );
    } catch ( e )
    {
        return d.aoiError.fnError( d, "custom", {}, `Failed To Parse Data With Reason: ${ e.message }` );
    }

    for ( const el of d.arrays[ name ] )
    {
        const c = { ...cmd };
        c.code = c.code.replaceAll("{value}", el);
        const result = await Interpreter(
            d.client,
            d.message,
            d.args,
            c,
            d.client.db,
            true,
            undefined,
            { ...d.data, awaitData: parsedData }
        );
    }

    return {
        code: d.util.setCode( data ),
    };
};