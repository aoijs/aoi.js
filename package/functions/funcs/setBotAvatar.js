module.exports = async d => {
    const code = d.command.code
    
    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
    
    const b = await d.client.user.setAvatar(inside.addBrackets()).catch(err => {})
    
    if (!b) return d.error(`\`Failed to change bot avatar\``)
        
    return {
        code: code.replaceLast(`$setBotAvatar${inside}`,"")
    }
}  