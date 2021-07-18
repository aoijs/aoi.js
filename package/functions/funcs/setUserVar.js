const setUserVar = async d => {
 const code = d.command.code

 const inside = d.unpack()
 const err = d.inside(inside)

 if (err) return d.error(err)

 let [ variable, value, userID = d.message.author.id, guildID] = inside.splits
 
 if (!guildID) guildID = d.message.guild ? d.message.guild.id : "" 
 
 if (d.client.variables[variable] === undefined) return d.error(`\`VariableError: '${variable}' not found!\``)

 d.client.db.set("main", `${variable}_${guildID}_${userID}`, value)

 return {
 code: code.replaceLast(`$setUserVar${inside}`, "")
 }
}

module.exports = setUserVar