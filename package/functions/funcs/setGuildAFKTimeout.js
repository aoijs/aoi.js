module.exports = async d => {
    const code = d.command.code;

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

    const opts = {
        "1m": 60,
        "5m": 300,
        "15": 900,
        "30m": 1800,
        "1h": 3600
    }

    const guild = await d.message.guild.edit({
        afkTimeout: opts[inside.addBrackets()]
    }).catch(err => {})

    if (!guild) return d.error(`:x: Failed to set AFK Timeout!`);

    if (!opts[inside.addBrackets()]) return d.error(`:x: Invalid input at \`$setGuildAFKTimeout${inside}\``);

    return {
        code: code.replaceLast(`$setGuildAFKTimeout${inside}`, "")
    }
}