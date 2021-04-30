const interpreter = require("../../interpreter") 

module.exports = async d => {
 const code = d.command.code 
 
 const inside = d.unpack()
 const err = d.inside(inside)

 if (err) return d.error(err)
 
 const [reader, split, command, separator = " "] = inside.splits
 
 const cmd = d.client.awaited_commands.find(c => c.name === command) 
 
 if (!cmd) return d.error(`❌ Invalid awaited command in \`$map${inside}\``)
 
 const array = reader.addBrackets().split(split.addBrackets()) 
 
 const data = [] 
 
 for (const val of array) {
 const c = Object.assign(Object.create(cmd), cmd) 
 
 c.code = c.code.replace(/{value}/gi, val.deleteBrackets())
 
 const text = await interpreter(d.client, d.message, d.args, c, undefined, true)
 
 if (text) data.push(text.deleteBrackets())
 }
 
 return {
 code: code.replaceLast(`$map${inside}`, data.join(separator))
 }
}