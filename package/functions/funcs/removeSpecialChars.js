module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$removeSpecialChars").length - 1;

  const inside = code.split("$removeSpecialChars")[r].after();

  return {
    code: code.replaceLast(
      `$removeSpecialChars${inside}`,
      inside.addBrackets().replace(/\W|_/g, "").deleteBrackets()
    ),
  };
};
