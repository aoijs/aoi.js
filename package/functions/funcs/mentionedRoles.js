const mentionedRoles = d => {
  
  let code = d.command.code
  
  const inside = d.unpack()
  const err = d.inside(inside)

  if (err) return d.error(err)
  
  const mention = inside.inside
  
  if (isNaN(mention)) return d.error(`❌ Invalid mention number in \`$mentionedRoles${inside}\``)
  
  const role = d.message.mentions.roles.array()[Number(mention) - 1]
  
  return {
    code: code.replaceLast(`$mentionedRoles${inside}`, role ? role.id : "") 
  } 
}

module.exports = mentionedRoles 