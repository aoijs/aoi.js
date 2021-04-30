module.exports = async d => {
  
  const code = d.command.code
  
  const inside = d.unpack()
  const err = d.inside(inside)

  if (err) return d.error(err)
  
  const role = d.message.guild.roles.cache.get(inside.inside) 
  
  return {
    code: code.replaceLast(`$roleExists${inside}`, role ? true : false) 
  } 
}

