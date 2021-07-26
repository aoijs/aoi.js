module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  let result;
  const [guildID = d.message.guild.id] = inside.splits;
  
  const guild = d.client.guilds.cache.get(guildID)
  
  if(!guild) return d.error(`\`$voiceMembersCount: Invalid guild ID in ${inside}\``)
  result = guild.channels.cache.filter(x=>x.type == "voice").map(x=>x.members.size).reduce((x,y) => x+y)
  

  return {
    code: code.replaceLast(`$voiceMembersCount${inside.total}`, result),
  };
};
