const {MessageEmbed} = require('discord.js')
const addTimestamp = (d) => {
  const code = d.command.code;
  const inside = d.unpack();
    const [index,time=null] = inside.splits;  
   if(!d.embeds[index-1]) d.embeds[index-1] = new MessageEmbed()
    return {
      code: code.replaceLast(`$addTimestamp${inside}`, ""),
      embeds:  d.embeds[index-1].setTimestamp(Number(time))
    }
  }
module.exports = addTimestamp;