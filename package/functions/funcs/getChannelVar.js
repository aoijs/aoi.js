const getChannelVar = async d => {

	const code = d.command.code

	const r = code.split("$getChannelVar").length - 1

	const inside = code.split("$getChannelVar")[r].after()

	const err = d.inside(inside)

	if (err) return d.error(err)

	const [variable, channelID = d.message.channel.id] = inside.splits

	if (d.client.variables[variable] === undefined) return d.error(`\`VariableError: '${variable}' not found!\``)

	let item = await d.client.db.get("main", `${variable}_${channelID}`)

	if (!item)
		item = { value: d.client.variables[variable] }

	return {
		code: code.replaceLast(`$getChannelVar${inside}`, item.value)
	}
}

module.exports = getChannelVar