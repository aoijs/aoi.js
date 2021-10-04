module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$colorRole").length - 1;

  const inside = code.split("$colorRole")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [roleID, color] = inside.splits;

  const role = d.message.guild.roles.cache.get(roleID);

  if (!role) return d.error(`:x: Invalid role ID in \`$colorRole${inside}\``);

  const re = await role.setColor(color).catch((err) => {});

  if (!re)
    return d.error(`:x: Failed to change ${role.name} color to ${color}!`);

  return {
    code: code.replaceLast(`$colorRole${inside}`, ""),
  };
};
