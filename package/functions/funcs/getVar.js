module.exports = async d => {
    const data = d.util.openFunc( d );
    if( data.err ) return d.error( data.err);
    
    let [ varname,table  = d.client.db.tables[ 0 ] ] = data.inside.splits;
    varname = varname.addBrackets();
    
    if( !d.client.variableManager.cache.has( varname ) ) return d.aoiError.fnError( d,'custom',{},`Variable "${ varname }" Not Found` );
    
    data.result = (await d.client.db.get( table,varname))?.value || d.client.variableManager.get( varname )?.value ;
    
    return {
        code : d.util.setCode( data )
    }
}