module.exports = async d => {
    const data = d.util.openFunc( d );
    if( data.err ) return d.error( data.err );

    const [ varname,value,userId = d.author.id,table = d.client.db.tables[0] ] = data.inside.splits;

    if( !d.client.variableManager.has(varname.addBrackets())) return d.aoiError.fnError( d,'custom',{},`Variable ${varname.addBrackets()} Not Found!` ) 
    
    try{
     d.client.db.set( table,varname.addBrackets(),userId,value );
    }
    catch( e ) {
        d.aoiError.fnError( d,'custom',{},`Failed To Set Value To The Variable: "${varname.addBrackets()}" With Reason: ${e}` );
    }
    
    return {
        code : d.util.setCode( data )
    }
}