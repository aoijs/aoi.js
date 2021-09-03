module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$concatTextSplit").length - 1;

  const inside = code.split("$concatTextSplit")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [text, separator] = inside.splits;

  const arr = text.addBrackets().split(separator.addBrackets());

  return {
    array: d.array.concat(arr),
    code: code.replaceLast(`$concatTextSplit${inside}`, ""),
  };
};
