const embed = require("../../handlers/errors.js");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const error = fields.pop();

  const ids = fields;

  if (!ids.includes(d.message.channel.parentID)) return embed(d, error);

  return {
    code: code.replaceLast(`$onlyForCategories${inside}`, ""),
  };
};
