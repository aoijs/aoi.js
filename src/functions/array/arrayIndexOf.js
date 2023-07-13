module.exports = async d =>
{
    const data = d.util.aoiFunc( d );
    if ( data.err ) return d.error( data.err );

    const [ name,query ] = data.inside.splits;
    if ( !d.data.arrays[ name ] )
    {
        return d.aoiError.fnError( d, "custom", { inside: data.inside }, "Array with name '" + name + "' does not exist." );
    }

    data.result = d.arrays[ name ].indexOf(query)+1;

    return {
        code: d.util.setCode( data ),
    };
};