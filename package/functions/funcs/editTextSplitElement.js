module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$editTextSplitElement").length - 1;

  const inside = code.split("$editTextSplitElement")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [index, value] = inside.splits;

  const n = Number(index);

  if (!n)
    return d.error(`Invalid number in \`$editTextSplitElement${inside}\``);

  d.array[n - 1] = value.addBrackets();

  return {
    array: d.array,
    code: code.replaceLast(`$editTextSplitElement${inside}`, ""),
  };
};
