module.exports = async d => {

 const code = d.command.code

 const r = code.split("$getGlobalUserVar").length - 1

 const inside = code.split("$getGlobalUserVar")[r].after()

 const err = d.inside(inside)

 if (err) return d.error(err)

 const [ variable, userID = d.message.author.id ] = inside.splits

 if (d.client.variables[variable] === undefined) return d.error(`\`VariableError: '${variable}' not found!\``)

 let item = await d.client.db.get("main", `${variable}_${userID}`)
 
 if (!item)
 item = { value: d.client.variables[variable] }

 return {
 code: code.replaceLast(`$getGlobalUserVar${inside}`, item.value)
 }
}