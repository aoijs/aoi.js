const error = require("../../handlers/errors.js")

module.exports = async d => { 
  let code = d.command.code
  
  const r = code.split("$math").length - 1
  
  const inside = code.split("$math")[r].after()

	const err = d.inside(inside)

	if (err) return d.error(err)

	let result
	
	const OPERATORS = /([0-9]|\/|\+|\*|-|%|<|\(|\)|\[|\]|\.)/g  
	
	try {
	    const operation = inside.inside.match(OPERATORS).join("")
	    
	    if (inside.inside.replace(OPERATORS, "").length) return d.error(`\`${d.func}: Invalid operation in ${inside.total}\``)
	    
  	result = eval(operation)
	} catch {
		return d.error(`\`${d.func}: Failed to calculate in ${inside.total}\``)
	}
  
  return {
   code:d.command.code.replaceLast(`$math${inside.total}`, result)
  }
}