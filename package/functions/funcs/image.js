const Discord =require("discord.js") 
const image = d => {

  const r = d.command.code.split("$image").length
  
  if (r >= 3) return d.message.channel.send(`❌ Can't use more than one $image.`)
  
  const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
  
  let [url, name] = inside.splits
  
  url = url.addBrackets() 
  
  let img = url 
  
  return {
    code: d.command.code.replaceLast(`$image${inside}`, ""),
    embed: d.embed.setImage(img) 
  }
}

module.exports = image 