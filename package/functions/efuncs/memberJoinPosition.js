module.exports = async d => {
    const code = d.command.code 
    
    const r = code.split("$memberJoinPosition").length - 1 
    
    const data = code.split("$memberJoinPosition")[r].after() 
    
    const userID = data.inside || d.message.author.id 
    
    const member = await d.message.guild.members.fetch(userID).catch(err => null) 
    
    if (!member) return d.error(`❌ Invalid user ID in \`$memberJoinPosition${data.total}]\``)
    
    const position = d.message.guild.members.cache.array().sort((x, y) => x.joinedTimestamp - y.joinedTimestamp).findIndex(m => m.id === userID) + 1 || "" 
    
    return {
        code: code.replaceLast(`$memberJoinPosition${data.total}`, position)
    }
}