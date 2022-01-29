module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  const [roleID, color] = data.inside.splits;

  const role = d.guild.roles.cache.get(roleID);
  if (!role) return d.error(`${d.func}: Invalid role ID in ${data.inside}`);

  const re = await role.setColor(color).catch((err) => {});
  if (!re)
    return d.error(
      `${d.func}: Failed to change ${role.name} color to ${color}!`,
    );

  return {
    code: d.util.setCode(data),
  };
};
