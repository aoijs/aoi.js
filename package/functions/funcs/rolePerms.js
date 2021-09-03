const keyPerms = require("../../utils/permissions.js");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [roleID, separator = ", "] = inside.splits;

  const role = d.message.guild.roles.cache.get(roleID);

  if (!role) return d.error(`:x: Invalid role ID in \`$rolePerms${inside}\``);

  return {
    code: code.replaceLast(
      `$rolePerms${inside}`,
      role.permissions
        .toArray()
        .filter((perm) => Object.values(keyPerms).includes(perm))
        .map((perm) =>
          perm
            .split("_")
            .map((word) =>
              word.toLowerCase().replace(word.toLowerCase()[0], word[0])
            )
            .join(" ")
        )
        .join(separator)
    ),
  };
};
