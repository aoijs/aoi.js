const Discord = require("discord.js");
module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack()
  const [seperator = ","]= inside.splits;
    let result;
   if(d.client.application.owner === null) d.client.application.fetch() 
   const owner = d.client.application.owner 
   result = owner instanceof Discord.Team ? owner.members.map(x=>x.id).join(seperator) : owner.id 
  return {
    code: d.util.setCode({function:d.func,inside, result})
  };
};
