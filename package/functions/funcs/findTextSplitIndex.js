module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$findTextSplitIndex").length - 1;

  const inside = code.split("$findTextSplitIndex")[r].after();

  return {
    code: code.replaceLast(
      `$findTextSplitIndex${inside}`,
      d.array.findIndex((value) => value === inside.inside) + 1
    ),
  };
};
