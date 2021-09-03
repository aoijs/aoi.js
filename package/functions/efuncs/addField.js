const {MessageEmbed} = require('discord.js')
module.exports = async (d) => {
  let code = d.command.code;
  const inside = d.unpack();  
  const [index,title, value, inline = "no"] = inside.splits;
  if (!value || !value.length)
    return d.error(d.aoiErrorFunctionErrorResolve(d,"custom",{inside},"Field Value Not Provided In"));
    if(!d.embeds[index-1]) d.embeds[index-1] = new MessageEmbed()
  d.embeds[index-1].addField(
   title.addBrackets(),
      value.addBrackets(),
      inline.replace('yes',true)
                   .replace('true',true)
      			   .replace('no',false)
      			   .replace('fase',false)
                            ) 
  return {
    code: code.replaceLast(`$addField${inside.total}`, ""),
    embeds:d.embeds
  };
};
