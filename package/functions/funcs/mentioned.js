const mentioned = d => {
  
  let code = d.command.code
  
  const inside = d.unpack()
  const err = d.inside(inside)

  if (err) return d.error(err)

  const [ mention, returnUser = "no" ] = inside.splits
  
  if (isNaN(mention)) return d.error(`❌ Invalid mention number in \`$mentioned${inside}\``)
  
  const user = d.message.mentions.users.array()[Number(mention) - 1]
  
  return {
    code: code.replaceLast(`$mentioned${inside}`, user ? user.id : returnUser === "yes" ? d.message.author.id : "") 
  } 
}

module.exports = mentioned 