module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$removeLinks").length - 1;

  const inside = code.split("$removeLinks")[r].after();

  return {
    code: code.replaceLast(
      `$removeLinks${inside}`,
      inside.addBrackets().replace(/(?:https?|ftp):\/\/[\n\S]+/g, "").deleteBrackets()
    ),
  };
};
