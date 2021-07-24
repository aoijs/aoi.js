module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$removeNumbers").length - 1;

  const inside = code.split("$removeNumbers")[r].after();

  return {
    code: code.replaceLast(
      `$removeNumbers${inside}`,
      inside.addBrackets().replace(/[0-9]/g, "").deleteBrackets()
    ),
  };
};
