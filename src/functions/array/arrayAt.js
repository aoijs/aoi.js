module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if ( data.err ) return d.error( data.err );

    const [ name,index ] = data.inside.splits;
    if ( !d.data.arrays[ name ] )
    {
        return d.aoiError.fnError( d, "custom", { inside: data.inside }, "Array with name '" + name + "' does not exist." );
    }

    data.result = d.arrays[ name ].at(index-1);

    return {
        code: d.util.setCode(data),
    };
};