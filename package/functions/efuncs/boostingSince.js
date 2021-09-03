module.exports = async (d) => {
  const code = d.command.code;
  const data = d.unpack()
  const [userId= d.message.author.id, option = "date",guildId=d.guild.id] = data.splits;
  const guild = await d.util.getGuild(d,guildId)
  const member = await d.util.getMember(guild,userId)
  if (!member)
    return d.error(
      d.aoiError.functionErrorResolve(d,"member",{inside})
    );
let result = member.premiumSinceTimestamp ? option === "date" ? member.premiumSince:member.premiumSinceTimestamp():null ?? ""
  return {
    code: d.util.setCode({function:d.func,inside:data,result:result})

  };
};
