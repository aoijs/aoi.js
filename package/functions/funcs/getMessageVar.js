const getMessageVar = async d => {

 const code = d.command.code

 const r = code.split("$getMessageVar").length - 1

 const inside = code.split("$getMessageVar")[r].after()
 const err = d.inside(inside)

 if (err) return d.error(err)

 const [ variable, messageID = d.message.id ] = inside.splits

 if (d.client.variables[variable] === undefined) return d.error(`\`VariableError: '${variable}' not found!\``)

 let item = await d.client.db.get("main",`${variable}_${messageID}`)
 
 
 if (!item) {
 item = d.client.variables[variable]
 } else {
 item = item.value
 }

 return {
 code: code.replaceLast(`$getMessageVar${inside}`, item)
 }
}

module.exports = getMessageVar