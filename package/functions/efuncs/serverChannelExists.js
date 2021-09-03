module.exports = async d => {
  
  const code = d.command.code
  
  const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
  
  const channel = d.message.guild.channels.cache.get(inside.inside) 
  
  return {
    code: code.replaceLast(`$serverChannelExists${inside}`, channel ? true : false) 
  } 
}

