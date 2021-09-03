const {MessageEmbed} = require('discord.js') 
const footer = (d) => {
  const r = d.command.code.split("$footer").length;

  

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [index=1,text, url] = inside.splits;
if(isNaN(index)) d.error(`${d.func}: Invalid Index in ${inside}`)
   if(!d.embeds[index-1]) d.embeds[index-1] = new MessageEmbed() 
    d.embeds[index-1].setFooter(text.addBrackets(),url.addBrackets())
  return {
    code: d.command.code.replaceLast(`$footer${inside}`, ""),
    embeds: d.embeds 
  };
};

module.exports = footer;
