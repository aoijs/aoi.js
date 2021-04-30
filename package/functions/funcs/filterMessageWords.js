module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$filterMessageWords").length - 1;

  const inside = code.split("$filterMessageWords")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [text, caseSensitive, ...words] = inside.splits;

  const newText = text
    .addBrackets()
    .replace(
      new RegExp(
        `(${words.join("|").addBrackets()})`,
        `g${caseSensitive === "yes" ? "" : "i"}`
      ),
      ""
    )
    .trim();

  return {
    code: code.replaceLast(
      `$filterMessageWords${inside}`,
      newText.deleteBrackets()
    ),
  };
};
