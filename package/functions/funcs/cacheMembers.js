module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$cacheMembers").length - 1;
  const inside = code.split("$cacheMembers")[r].after();

  const [guildID = d.message.guild.id, returnCount = "no"] = inside.splits;
  const guild = d.client.guilds.cache.get(guildID);

  if (!guild)
    return d.error(`\`${d.func}: Invalid guildID in ${inside.total}\``);

  const prev = guild.members.cache.size;

  if (guild.members.cache.size !== guild.memberCount)
    await guild.members.fetch();

  const aft = guild.members.cache.size;

  return {
    code: code.replaceLast(
      `$cacheMembers${inside.total}`,
      returnCount.toLowerCase() === "yes" ? aft - prev : ""
    ),
  };
};
