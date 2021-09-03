module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack()

  const [guildID = d.message.guild.id,showDiff = "no"] = inside.splits;
  const guild = d.client.guilds.cache.get(guildID);

  if (!guild)
    return d.error(d.aoiError.functionErrorResolve(d,"guild",{inside}));

  const prev = guild.members.cache.size;

  if (guild.members.cache.size !== guild.memberCount)
    await guild.members.fetch();

  const aft = guild.members.cache.size;

  return {
    code: code.replaceLast(
      `$cacheMembers${inside.total}`,
      showDiff.toLowerCase() === "yes" ? aft - prev : ""
    ),
  };
};
