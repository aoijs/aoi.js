module.exports = async d => {
    const code = d.command.code 
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const [userID, roleID] = inside.splits
    
    const s = await d.client.api.guilds(d.message.guild.id).members(userID).roles(roleID).put().catch(err => null)
    
    if (!s) return d.error(`\`${d.func}: Failed to give role\``)
    
    return {
        code: code.replaceLast(`$giveRole${inside}`, "")
    }
}
