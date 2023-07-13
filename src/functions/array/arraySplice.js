module.exports = async d =>
{
    const data = d.util.aoiFunc( d );
    if ( data.err ) return d.error( data.err );

    const [ name, index,amount,...elements ] = data.inside.splits;

    if ( !d.data.arrays[ name ] )
    {
        return d.aoiError.fnError( d, "custom", { inside: data.inside }, "Array with name '" + name + "' does not exist." );
    }

    data.result = d.arrays[ name ].splice(index,amount,...elements);
    d.data.arrays = d.arrays;
    return {
        code: d.util.setCode( data ),
        arrays: d.arrays,
        data: d.data,
    };
};