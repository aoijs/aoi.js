module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  let result;
  const [guildID = d.message.guild.id] = inside.splits;
  
  const guild = d.client.guilds.cache.get(guildID)
  
  if(!guild) return d.error(`\`${d.func}: Invalid guild ID in ${inside}\``)
  
  const channels = guild.channels.cache.filter(x=>x.type == "voice").map(x=>x.members.size)
  result = channels.length == 0 ? 0 : channels.reduce((x,y) => x+y)

  return {
    code: code.replaceLast(`$voiceMembersCount${inside.total}`, result),
  };
};
