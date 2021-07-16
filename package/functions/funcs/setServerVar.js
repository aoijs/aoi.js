const setServerVar = async d => {
 const code = d.command.code

 const inside = d.unpack()

	const err = d.inside(inside)
	if (err) return d.error(err)

 const [ variable, value, guildID = d.message.guild.id ] = inside.splits

 if (d.client.variables[variable] === undefined) return d.error(`\`VariableError: '${variable}' not found!\``)


 d.client.db.set("main", `${variable}_${guildID}`, value)
 return {
 code: code.replaceLast(`$setServerVar${inside}`, "")
 }
}

module.exports = setServerVar