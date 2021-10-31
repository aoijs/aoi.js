module.exports = async d => {
    const data = d.util.openFunc(d);
    if( data.err ) return d.error( data.err );
    
    d.data.interaction?.deleteReply();
    
    return {
        code : d.util.setCode({
            function : d.func,
            code : data.code,
            result : undefined 
        })
    } 
} 