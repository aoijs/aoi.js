const {MessageEmbed} = require('discord.js')
module.exports = async (d) => {
  let code = d.command.code;
  const inside = d.unpack();  
  let [index=0,...fields] = inside.splits;
    if(isNaN(index-1)) d.error("$addFields: Invalid Index in "+inside.total)
    if(!d.embeds[index-1]) d.embeds[index-1] = new MessageEmbed()
    const Field = []
    for(const field of fields){
        const [title,value,inline="no"] =field.split(":")
  if (!value || !value.length)
    return d.error("$addField: Field Value Not Provided In "+inside.total);    
      Field.push({name:title.addBrackets(),value:value.addBrackets(),inline:inline.replace("yes",true).replace("true",true).replace("false",false).replace("no", false)})
        }
  d.embeds[index-1].addFields(Field)


  return {
    code: code.replaceLast(`$addField${inside.total}`, ""),
    embeds:d.embeds
  };
};
