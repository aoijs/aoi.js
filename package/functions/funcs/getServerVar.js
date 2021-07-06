const getServerVar = async d => {

	const code = d.command.code

	const r = code.split("$getServerVar").length - 1

	const inside = code.split("$getServerVar")[r].after()

	const err = d.inside(inside)

	if (err) return d.error(err)

	let [variable, guildID] = inside.splits
	
	if (!guildID) {
 if (!d.message) {
 return {
 code:code.replaceLast(`$getServerVar${inside}`, "")
 }
 } else {
 guildID = d.message.guild ? d.message.guild.id : ""
 }
 }
	
	if (d.client.variables[variable] === undefined) return d.error(`\`VariableError: '${variable}' not found!\``)

	let item = await d.client.db.get("main", `${variable}_${guildID}`)

	if (!item)
		item = { value: d.client.variables[variable] }

	return {
		code: code.replaceLast(`$getServerVar${inside}`, item.value)
	}
}

module.exports = getServerVar