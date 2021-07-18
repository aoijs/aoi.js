const title = d => {

  const r = d.command.code.split("$title").length
  
  if (r >= 3) return d.message.channel.send(`\`${d.func}: Can't use more than one\``)
  
  const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
  
  const [title, url] = inside.splits 
  
  if (url) d.embed.setURL(url.addBrackets()) 
  
  return {
    code: d.command.code.replaceLast(`$title${inside}`, ""),
    embed: d.embed.setTitle(title.addBrackets()) 
  }
}

module.exports = title