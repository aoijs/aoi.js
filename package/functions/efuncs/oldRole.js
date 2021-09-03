const roleOptions = require("../../utils/roleOptions");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const option = Object.keys(roleOptions).find((opt) => opt === inside.inside);

  if (!option) return d.error(`❌ Invalid option in \`$oldRole${inside}\``);

  const executor = roleOptions[option].split(";")[1];

  return {
    code: code.replaceLast(
      `$oldRole${inside}`,
      d.data.old_role ? eval(`d.data.old_role${executor}`) : ""
    ),
  };
};
