const embed = require("../../handlers/errors");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$blackListServerIDs").length - 1;

  const inside = code.split("$blackListServerIDs")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const errorMsg = fields.pop();

  if (fields.includes(d.message.guild.id)) return embed(d, errorMsg);

  return {
    code: code.replaceLast(`$blackListServerIDs[${inside}]`, ""),
  };
};
