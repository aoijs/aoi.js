module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$checkContains").length - 1;

  const inside = code.split("$checkContains")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const msg = fields.shift().addBrackets();

  return {
    code: code.replaceLast(
      `$checkContains${inside}`,
      fields.some((field) => msg.includes(field.addBrackets()))
    ),
  };
};
