const embed = require("../../handlers/errors");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$blackListIDs").length - 1;

  const inside = code.split("$blackListIDs")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const errorMsg = fields.pop();

  if (fields.includes(d.message.author.id)) return embed(d, errorMsg);

  return {
    code: code.replaceLast(`$blackListIDs${inside}`, ""),
  };
};
