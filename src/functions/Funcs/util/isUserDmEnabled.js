module.exports = async d => {
    const data = d.util.openFunc( d );

    const [ userId = d.author.id ] = data.inside.splits;

    const user = await d.util.getUser( d,userId );
    if( !user ) return d.util.aoiError.fnError( d,'user',{ inside : data.inside });

    data.result = user.dmChannel ? true : false;

    return {
        code : d.util.setCode( data )
    }
}