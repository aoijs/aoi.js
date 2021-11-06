module.exports = async d => {
    const data = d.util.openFunc( d );
    if( data.err ) return d.error( data.err );
    data.result = d.client?.readyTimestamp
    return {
        code: d.util.setCode(data)
    }
}
