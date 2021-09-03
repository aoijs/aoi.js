const divide = async (d) => {
  const code = d.command.code;

  const r = code.split("$divide").length - 1;

  const inside = code.split("$divide")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  if (fields.some((n) => isNaN(Number(n))))
    return d.error(`:x: Invalid number in \`$divide${inside}\``);

  const n = fields.reduce((x, y) => Number(x) / Number(y));

  return {
    code: code.replaceLast(`$divide${inside}`, n),
  };
};

module.exports = divide;
