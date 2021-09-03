module.exports = (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const n = Number(inside.inside);

  return {
    code: code.replaceLast(
      `$isNumber${inside}`,
      inside.inside.trim() === "" ? false : isNaN(inside.inside.trim()) ? false : true
    ),
  };
};
