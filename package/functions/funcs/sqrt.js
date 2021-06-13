const error = require("../../handlers/errors.js")

module.exports = async d => { 
  let code = d.command.code
  
  const r = code.split("$sqrt").length - 1
  
  const inside = code.split("$sqrt")[r].after()

	if (!inside.inside) return d.error(`:x: Invalid usage in $sqrt{inside.total}`)

	let sqrt = Math.sqrt(inside.inside)
  
  return {
   code:d.command.code.replaceLast(`$sqrt${inside.total}`, sqrt)
  }
}
