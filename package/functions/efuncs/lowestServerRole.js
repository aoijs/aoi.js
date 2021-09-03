module.exports = async d => {
    const code = d.command.code 
    
    return {
        code: code.replaceLast(`$lowestServerRole`, d.message.guild ? (d.message.guild.roles.cache.sort((r, y) => r.position - y.position).array().slice(1)[0] || "").id || "": "") 
    }
}