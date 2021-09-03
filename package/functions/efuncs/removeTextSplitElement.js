module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const n = Number(inside.inside);

  if (!n)
    return d.error(
      `:x: Invalid number in \`$removeTextSplitElement${inside}\``
    );

  return {
    array: d.array.filter((value, y) => y !== n - 1),
    code: code.replaceLast(`$removeTextSplitElement${inside}`, ""),
  };
};
