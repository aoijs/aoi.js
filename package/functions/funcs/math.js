const error = require("../../handlers/errors.js")

module.exports = async d => { 
  let code = d.command.code
  
  const r = code.split("$math").length - 1
  
  const inside = code.split("$math")[r].after()

	if (!inside.inside) return d.error(`:x: Invalid usage in $math${inside.total}`)

	let result
	
	const OPERATORS = /([0-9]|\/|\+|\*|-|%|<|\(|\)|\[|\]|\.)/g  
	
	try {
	    const operation = inside.inside.match(OPERATORS).join("")
	    
	    if (inside.inside.replace(OPERATORS, "").length) return d.error(`❌ Invalid operation in \`$math${inside.total}\``)
	    
  	result = eval(operation)
	} catch {
		return d.error(`:x: Failed to calculate in \`$math${inside.total}\``)
	}
  
  return {
   code:d.command.code.replaceLast(`$math${inside.total}`, result)
  }
}