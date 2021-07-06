const getUserVar = async d => {

	const code = d.command.code

	const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

	let [variable, userID = d.message.author.id, guildID] = inside.splits
	
	if (!guildID) guildID = d.message.guild ? d.message.guild.id : "" 
	
	if (d.client.variables[variable] === undefined) return d.error(`\`VariableError: '${variable}' not found!\``)

	let item = await d.client.db.get("main", `${variable}_${guildID}_${userID}`)

	if (!item)
		item = { value: d.client.variables[variable] }

	item = item.value

	return {
		code: code.replaceLast(`$getUserVar${inside}`, item)
	}
}

module.exports = getUserVar