const setMessageVar = async d => {
 const code = d.command.code

 const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)

 const [ variable, value, messageID = d.message.id ] = inside.splits

 if (d.client.variables[variable] === undefined) return d.error(`\`VariableError: '${variable}' not found!\``)
 
 d.client.db.set("main", `${variable}_${messageID}`, value)

 return {
 code: code.replaceLast(`$setMessageVar${inside}`, "")
 }
}

module.exports = setMessageVar