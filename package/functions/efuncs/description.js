const {MessageEmbed} = require('discord.js')
const description = (d) => {
 const {code} = d.command 
 const inside = d.unpack()
  const err = d.inside(inside);
  if (err) return d.error(err);
    const [index=1,desc] = inside.splits;
if(isNaN(index) || index ==="") return d.error(`${d.func}: Invalid Index in ${inside.total}`)
    if(!d.embeds[index-1]) d.embeds[index-1] = new MessageEmbed()
    d.embeds[index-1]. setDescription (desc.addBrackets())
  return {
    code: code.replaceLast(`$description${inside}`, ""),
    embeds: d.embeds
  };
};

module.exports = description;
