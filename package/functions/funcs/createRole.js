const keyPerms = require("../../utils/permissions");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$createRole").length - 1;

  const inside = code.split("$createRole")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [name, color, mentionable, hoisted, position, ...perms] = inside.splits;

  const permissions = Object.entries(keyPerms)
    .filter((perm) => perms.includes(perm[0]))
    .map((perm) => perm[1]);

  const role = await d.message.guild.roles
    .create({
      data: {
        name: name,
        color: color,
        mentionable: mentionable === "yes",
        hoist: hoisted === "yes",
        position: position,
        permissions: permissions,
      },
    })
    .catch((err) => {});

  if (!role) return d.error(`:x: Failed to create role!`);

  return {
    code: code.replaceLast(`$createRole${inside}`, ""),
  };
};
