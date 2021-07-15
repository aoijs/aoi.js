module.exports = async (d) => {
  const { code } = d.command;
  const r = code.split("$abbreviate").length - 1;
  const inside = code.split("$abbreviate")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [num, dec = "1"] = inside.splits;

  const n = Number(num);
  const de = Number(dec);

  if (isNaN(n))
    return d.error(`:x: Invalid number in \`$abbreviate${inside.total}\``);

  if (isNaN(de))
    return d.error(`:x: Invalid decimal in \`$abbreviate${inside.total}\``);

  let a;

  try {
    a = abbreviate(n, de);
  } catch {
    return d.error(
      `:x: There's an error while abbreviating \`$abbreviate${inside.total}\``
    );
  }

  return {
    code: code.replaceLast(`$abbreviate${inside.total}`, a),
  };
};



