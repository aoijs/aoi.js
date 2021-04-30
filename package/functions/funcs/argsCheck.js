const embed = require("../../handlers/errors.js");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$argsCheck").length - 1;

  const inside = code.split("$argsCheck")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [condition, error] = inside.splits;

  const operator = ["<", ">"].find((e) => condition.includes(e));

  let pass = true;

  const n = Number(condition.replace(operator || "", ""));

  if (operator === "<") {
    if (d.args[n] !== undefined) pass = false;
  } else if (operator === ">") {
    if (d.args[n - 1] === undefined) pass = false;
  } else {
    if (d.args.length !== n) pass = false;
  }

  if (!pass) return embed(d, error);

  return {
    code: code.replaceLast(`$argsCheck${inside.total}`, ""),
  };
};
