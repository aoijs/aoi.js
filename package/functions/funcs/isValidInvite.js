module.exports = async d => {
    const code = d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) { return d.error(err) }

    const url = inside.inside.includes("https://") ? inside : inside.inside.includes("discord.gg/") ? `https://${inside}` : `https://discord.gg/${inside}`

    const invite = await d.client.fetchInvite(url).catch(err => {})

    return {
        code: code.replaceLast(`$isValidInvite${inside}`, invite ? true : false)
    }
}