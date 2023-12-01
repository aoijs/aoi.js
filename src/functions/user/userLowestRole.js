module.exports = async (d) => {
  const data = d.util.aoiFunc(d);

  const [userID = d.author?.id, guildID = d.guild?.id, option = "id"] = data.inside.splits;

  const guild = await d.util.getGuild(d, guildID);
  if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

  const member = await d.util.getMember(guild, userID);
  if (!member) return d.aoiError.fnError(d, "member", { inside: data.inside });

  const role = member.roles.cache.filter((role) => role.id !== guild.id).sort((a, b) => a.position - b.position).first();

  data.result = !role
    ? guild?.roles.everyone.id
    : role === undefined
      ? guild.id
      : role?.[option.toLowerCase()];

  return { code: d.util.setCode(data) };
};
