const embed = require("../../handlers/errors");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$blackListRoleIDs").length - 1;

  const inside = code.split("$blackListRoleIDs")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const errorMsg = fields.pop();

  if (fields.some((id) => d.message.member.roles.cache.has(id)))
    return embed(d, errorMsg);

  return {
    code: code.replaceLast(`$blackListRoleIDs${inside}`, ""),
  };
};
