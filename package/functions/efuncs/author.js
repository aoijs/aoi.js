const {MessageEmbed} = require('discord.js')
const author = (d) => {
  const inside = d.unpack();
  const err = d.inside(inside);
  if (err) return d.error(err);
  const [index,text, url = "", link = ""] = inside.splits;
     if(!d.embeds[index-1]) d.embeds[index-1] = new MessageEmbed()
    d.embeds[index-1].setAuthor(text.addBrackets(),url.addBrackets(),link.addBrackets())
  return {
    code: d.command.code.replaceLast(`$author${inside}`, ""),
    embeds: d.embeds 
  };
};
module.exports = author;