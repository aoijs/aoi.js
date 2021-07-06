module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$ban").length - 1;

  const inside = code.split("$ban")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [userID = new String(), reason = undefined, days = 0] = inside.splits;

  const m = await d.client.users.fetch(userID).catch((err) => null);

  if (!m) return d.error(`\`${d.func}: Invalid user ID in ${inside}\``);

  const member = await d.message.guild.members
    .ban(m.id, {
      reason: reason,
      days: days,
    })
    .catch((err) => null);

  if (!member) return d.error(`\`Failed to ban ${m.username}\``);

  return {
    code: code.replaceLast(`$ban${inside}`, ""),
  };
};
