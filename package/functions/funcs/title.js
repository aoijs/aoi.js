const {MessageEmbed} = require('discord.js') 
const title = d => {
  const inside = d.unpack()
	const err = d.inside(inside)
	if (err) return d.error(err)

  let [index,title, url] = inside.splits 
if(isNaN(index) || index-1 <0 ) d.aoiError.fnError(d,"custom",{inside},"Invalid Index Provided In")
if(!d.embeds[index-1]) d.embeds[index-1] = new MessageEmbed()
  if (url) d.embeds[index-1].setURL(url.addBrackets()) 
d.embeds[index-1].setTitle(title.addBrackets()) 
  
  return {
    code: d.command.code.replaceLast(`$title${inside}`, ""),
    embeds: d.embeds
  }
}

module.exports = title
