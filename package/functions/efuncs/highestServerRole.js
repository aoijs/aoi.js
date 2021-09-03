module.exports = async d => {
    const code = d.command.code 
    
    return {
        code: code.replaceLast(`$highestServerRole`, d.message.guild ? d.message.guild.roles.highest.id : "")
    }
}