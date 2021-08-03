module.exports = async d => {
    const inside = d.unpack();
    const code = d.command.code;
    let res;
    const [roleID=d.message.guild.id,status="offline", separator=", ", countBots="yes"] = inside.splits;
        
    const role = roleID === d.message.guild.id ? roleID : d.message.guild.roles.cache.get(roleID)
    
    if(!role && roleID !== d.message.guild.id) return d.error(`\`${d.func}: Invalid role ID given in ${inside}\``)
    if(![
        "dnd",
        "offline",
        "online",
        "idle"
         ].includes(status.toLowerCase())) return d.error(`\`${d.func}: Invalid status given in ${inside}\``)
    
    res = d.message.guild.members.cache.filter(x=>x.presence.status === status.toString().toLowerCase() &&      x.roles.cache.has(role) && (countBots == "yes" ? true : x.user.bot == false)).map(x=>x.user.username).join(separator)
    
    return {
        code:code.replaceLast(`$usersWithRoleStatus{inside.total}`, res)
    }
}
