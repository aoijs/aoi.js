module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const [
        name,
        type = "PLAYING",
        status = "online"
    ]= inside.splits

    const bot = await d.client.user.setPresence({
        activity: {
            name: name,
            type: type.toUpperCase()
        },
        status: status 
    }).catch(err => {})

    if (!bot) return d.error(`\`Failed to change bot status\``)

    return {
        code: code.replaceLast(`$setStatus${inside}`, "")
    }
}