const mentionedChannels = d => {
  
  let code = d.command.code
  
  const inside = d.unpack()
  const err = d.inside(inside)

  if (err) return d.error(err)
  
  const [ mention, returnChannel = "no" ] = inside.splits
  
  if (isNaN(mention)) return d.error(`\`${d.func}: Invalid mention number in ${inside}\``)
  
  const channel = d.message.mentions.channels.array()[Number(mention) - 1]
  
  return {
    code: code.replaceLast(`$mentionedChannels${inside}`, channel ? channel.id : returnChannel === "yes" ? d.message.channel.id : "") 
  } 
}

module.exports = mentionedChannels 