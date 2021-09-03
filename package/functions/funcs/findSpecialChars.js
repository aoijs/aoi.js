module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$findSpecialChars").length - 1;

  const inside = code.split("$findSpecialChars")[r].after();

  return {
    code: code.replaceLast(
      `$findSpecialChars${inside}`,
      inside.addBrackets().replace(/(\w+)/g, "").deleteBrackets()
    ),
  };
};
