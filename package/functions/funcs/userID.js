module.exports = async d => {

    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    let user = d.client.users.cache.find(u => u.username.toLowerCase() === inside.inside.toLowerCase())

    return {
        code: code.replaceLast(`$userID${inside}`, user ? user.id : "")
    }
    
}