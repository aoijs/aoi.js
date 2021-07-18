const noEscapingMessage = d => {
  let code = d.command.code
  
  const inside = d.unpack()

  if (inside.inside) {
    const n = inside.inside
    
    if (isNaN(n)) return d.error(`\`${d.func}: Invalid number in ${inside}\``)
    
    code = code.replaceLast(`$noEscapingMessage${inside}`, d.args[Number(n) - 1] ? d.args[Number(n) - 1] : "")
  } else {
    code = code.replaceLast("$noEscapingMessage", d.args.join(" ")) 
  }
  
  return {
    code: code 
  } 
}
module.exports = noEscapingMessage