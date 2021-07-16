const nickname  = async d => {
  let code = d.command.code
  
  const inside = d.unpack()
  
  if (inside.inside) {
    const member = await d.message.guild.members.fetch(inside.inside).catch(err => {})
    
    if (!member)  return d.error(`\`${d.func}: Invalid user ID in ${inside}\``)
    
    code = code.replaceLast(`$nickname${inside}`, member.displayName.deleteBrackets())
  } else {
    code = code.replaceLast("$nickname", d.message.member.displayName.deleteBrackets())
  }
  
  return {
    code: code 
  } 
} 

module.exports =nickname 