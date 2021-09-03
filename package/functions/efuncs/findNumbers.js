module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$findNumbers").length - 1;

  const inside = code.split("$findNumbers")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  return {
    code: code.replaceLast(
      `$findNumbers${inside}`,
      inside.inside.replace(/[^0-9]/g, "")
    ),
  };
};
