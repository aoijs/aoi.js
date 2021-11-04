module.exports = async d => {
    const data = d.util.openFunc(d);
    if(data.err) return d.error(data.err);
    
    let [ memberResolver,returnSelf = "yes",guildId = d.guild.id ] = data.inside.splits;
    memberResolver = memberResolver.addBrackets().replace(/[\\<>@!]/g,"").trim();
    
    const guild = await d.util.getGuild(d,guildId);
    if(!guild) return d.aoiError.fnError(d,"guild",{ inside : data.inside });
    
    data.result = d.util.getMember(guild,memberResolver);
    
    data.result = data.result?.id || (returnSelf === "yes" ? d.author.id : undefined) ; 
    
    return {
        code : d.util.setCode( data ) 
    } 
} 