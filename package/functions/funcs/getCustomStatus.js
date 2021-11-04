module.exports = async d => {
    const data  = d.util.openFunc( d );
    
    const [ userId = d.author?.id,type = 'state' ] = data.inside.splits;
    
    const user = await d.util.getMember( d.guild ,userId );
    if( !user ) return d.aoiError.fnError( d,'member',{ inside : data.inside } );
    
   const status = user.presence.activities?.find( x => x.type === 'CUSTOM' );
   data.result =status?.[ type ];
    
    return {
        code : d.util.setCode( data )
    }
}