module.exports = async d => {
    const data = d.util.openFunc( d );
    if( data.err ) return d.error( data.err );
    
    const [ userId,roleId ] = data.inside.splits;
    
    const member = await d.util.getMember( d.guild,userId );
    if( !member ) return d.aoiError.fnError( d,'member',{ inside : data.inside });
    
    member.roles.add( roleId ).catch( e =>{
        d.aoiError.fnError( d,'custom',{},'Failed To Give Role With Reason: '+e );
    });
    
    return {
        code : d.util.setCode( data )
    }
}