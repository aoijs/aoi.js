module.exports = async d => {
    const code = d.command.code
    
    const inside = d.unpack()
    
    const users = await d.message.guild.fetchBans().catch(err => {})
    
    if (inside.inside) {
        const [options, separator = ", "] = inside.splits
        
        return {
            code: code.replaceLast(`$usersBanned${inside}`, users ? users.map(u => options === "mention" ? u.user.toString() : u.user[options.toLowerCase()] || u.user.username).join(separator).removeBrackets() : "missing permissions")
        }
    } else {
        return {
            code: code.replaceLast(`$usersBanned`, users ? users.map(e => e.user.username).join(", ").removeBrackets() : "missing permissions") 
        }
    }
} 