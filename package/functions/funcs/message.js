const message = d => {
  
  let code = d.command.code
  
  const inside = d.unpack()
  
  if (inside.inside) {
    let n = inside.inside
	
    if (["last", ">"].includes(n.addBrackets())) n = d.args.length 
    
    if (isNaN(n)) return d.error(`❌ Invalid number in \`$message${inside}\``)
    
    code = code.replaceLast(`$message${inside}`, d.args[Number(n) - 1] ? d.args[Number(n) - 1].deleteBrackets() : "")
  } else {
    code = code.replaceLast("$message", d.args.join(" ").deleteBrackets()) 
  }
  
  return {
    code: code 
  } 
}
module.exports = message