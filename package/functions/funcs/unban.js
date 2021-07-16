module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    let [
        userID = new String(),
        reason = undefined
    ] = inside.splits
    
    if (!Number(userID) || userID.length < 15) {
        const bans = await d.message.guild.fetchBans().catch(err => null) 
        
        if (bans) {
            const ban = bans.find(u => u.user.username === userID || u.user.tag === userID) 
            
            if (!ban) return d.error(`\`\`${d.func}: Invalid username in ${inside}\``)
            
            userID = ban.user.id 
        }
    }
    
    const user = await d.message.guild.members.unban(userID, reason).catch(err => null)

    if (!user) return d.error(`\`Failed to unban user\``)

    return {
        code: code.replaceLast(`$unban${inside}`, "")
    }
}