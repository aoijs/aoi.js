module.exports = d => {
  let code = d.command.code
  
  const inside = d.unpack()
  
  const args = d.args.join(" ").replace(/(<#(\d{17,19})>|<@!?(\d{17,19})>|<@&(\d{17,19})>)/g, "").trim().split(/ +/g) 
  
  if (inside.inside) {
    let n = inside.inside
        
    if (["last", ">"].includes(n.addBrackets())) n = args.length  
    if (isNaN(n)) return d.error(`\`${d.func}: Invalid number in ${inside}\``)
    
    code = code.replaceLast(`$noMentionMessage${inside}`, args[Number(n) - 1] ? args[Number(n) - 1].deleteBrackets() : "")
  } else {
    code = code.replaceLast("$noMentionMessage", args.join(" ").deleteBrackets()) 
  }
  
  return {
    code: code 
  } 
}