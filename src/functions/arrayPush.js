/**
 * @param {import("..").Data} d
 */
module.exports = async d =>
{
    const data = d.util.aoiFunc( d );
    if ( data.err ) return d.error( data.err );

    const [ name, ...elements ] = data.inside.splits;

    if (!d.data.arrays?.[name]) {
        return d.aoiError.fnError( d, "custom", { inside: data.inside }, "Array with name '" + name + "' does not exist." );
    }

    d.arrays[ name ].push( ...elements );
    d.data.arrays = d.arrays;
    return {
      code: d.util.setCode(data),
      arrays: d.arrays,
      data: d.data,
    };
};
