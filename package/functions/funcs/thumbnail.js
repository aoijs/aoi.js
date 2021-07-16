module.exports = async d => {
    const code = d.command.code

	if (code.split('$thumbnail').length > 2) return d.error(`\`${d.func}: Can't use more than one\``)

    const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
 
    d.embed.setThumbnail(inside.addBrackets() || undefined) 
  
    return { 
      embed: d.embed,
        code: code.replaceLast(`$thumbnail${inside}`, "")
    }
}