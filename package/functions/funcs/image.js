const Discord =require("discord.js") 
const image = d => {


  const inside = d.unpack()
	const err = d.inside(inside)

	if (err) return d.error(err)
  
  let [index=1,url, name] = inside.splits
  if(isNaN(index) || index <1) return d.error(`${d.func}:Invalid Index in ${inside}`)
  url = url.addBrackets() 
  if(!d.embeds[index-1]) d.embeds[index-1] = new Discord.MessageEmbed()
d.embeds[index-1].setImage(url)
  return {
    code: d.command.code.replaceLast(`$image${inside}`, ""),
    embeds: d.embeds
  }
}

module.exports = image 
