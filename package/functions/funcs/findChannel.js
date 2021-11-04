module.exports = async d => {
    const data = d.util.openFunc(d);
    if(data.err) return d.error(data.err);
    
    let [ channelResolver,returnSelf = "yes" ] = data.inside.splits;
channelResolver = channelResolver.addBrackets();
    
    data.result = d.client.channels.cache.find( x => x.id === channelResolver || x.name.toLowerCase() === channelResolver.toLowerCase() || x.toString() === channelResolver )?.id || (returnSelf === "yes" ? d.channel.id : undefined);
    
    

    return  {
        code : d.util.setCode( data ) 
    }       
} 