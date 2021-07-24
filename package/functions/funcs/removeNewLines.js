module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$removeNewLines").length - 1;

  const inside = code.split("$removeNewLines")[r].after();

  return {
    code: code.replaceLast(
      `$removeNewLines${inside}`,
      inside.addBrackets().replace(/(\r\n|\n|\r)/gm, "").deleteBrackets()
    ),
  };
};
