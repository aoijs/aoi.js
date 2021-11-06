module.exports = async d =>{
    const data = d.util.openFunc( d );
    if( data.err ) return d.error( data.err );
    data.result = d.client?.guilds?.cache.map(x=>x.memberCount??0).reduce((a,b)=>a+b)
    return {
        code:d.util.setCode( data )
    }
}
