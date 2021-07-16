module.exports = async d => {
    const code =d.command.code

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const guild = await d.message.guild.edit({
        icon: inside.addBrackets()
    }).catch(err => {})

    if (!guild) return d.error(`\`Failed to edit Guild Icon\``)

    return {
        code: code.replaceLast(`$setGuildIcon${inside}`, "")
    }
}//leref here