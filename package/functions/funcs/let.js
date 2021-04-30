const Discord = require("discord.js") 

module.exports = async (d) => {
let code = d.command.code
let vars = d.vars

    let r = code.split("$let").length - 1

    let inside = code.split("$let")[r].after()

	if (!inside.inside) return d.error(`:x: Invalid usage in $let${inside.total}`)

    let [letname, value] = inside.splits

    vars[letname] = value;

    code = code.replaceLast(`$let${inside.total}`, "")
    
    return {
        code: code
    }
  }