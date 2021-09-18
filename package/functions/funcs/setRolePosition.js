module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$setRolePosition").length - 1;

  const inside = code.split("$setRolePosition")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [roleID, newPosition] = inside.splits;

  const role = d.message.guild.roles.cache.get(roleID);

  if (!role) return d.error(`\`${d.func}: Invalid role ID in ${inside}\``);

  const re = await role.setPosition(newPosition).catch((err) => {});

  if (!re)
    return d.error(`\`Failed to change ${role.name} position to ${newPosition}\``);

  return {
    code: code.replaceLast(`$setRolePosition${inside}`, ""),
  };
};
