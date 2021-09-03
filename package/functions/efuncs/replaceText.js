const replaceText = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  let [text, match, replace] = inside.splits;

  if (replace === undefined)
    return d.error(`❌ Not enough fields in \`$replaceText${inside}\``);

  return {
    code: code.replaceLast(
      `$replaceText${inside}`,
      text
        .addBrackets()
        .split(match.addBrackets())
        .join(replace.addBrackets())
        .removeBrackets()
    ),
  };
};

module.exports = replaceText;
