module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$findChars").length - 1;

  const inside = code.split("$findChars")[r].after();

  return {
    code: code.replaceLast(
      `$findChars${inside}`,
      inside
        .addBrackets()
        .replace(/(\W|\d+)/g, "")
        .deleteBrackets()
    ),
  };
};
