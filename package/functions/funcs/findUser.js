module.exports = async d => {
    const data = d.util.openFunc(d);
    if(data.err) return d.error(data.err);
    
    let [ userResolver,returnSelf = "yes" ] = data.inside.splits;
    userResolver = userResolver.addBrackets().replace(/[\\<>@!]/g,"").trim();;
    

    data.result = d.client.users.cache.find( x => x.username.toLowerCase() === userResolver.toLowerCase() || x.tag.toLowerCase() === userResolver.toLowerCase() || x.id === userResolver || x.toString() === userResolver )
    if(!data.result) data.result = await d.client.users.fetch(userResolver).catch(e=>undefined);
    
    data.result = data.result?.id || (returnSelf === "yes" ? d.author.id : undefined) ; 
    
    return {
        code : d.util.setCode( data ) 
    } 
} 
