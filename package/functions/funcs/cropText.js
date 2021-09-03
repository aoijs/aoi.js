const { splitMessage } = require("discord.js");

module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  let [text, limit, charToSplit = "", append = ""] = inside.splits;

  limit = Number(limit);

  if (!limit) return d.error(`:x: Invalid number in \`$cropText${inside}\``);

  let texts;

  try {
    texts = splitMessage(text, {
      maxLength: limit,
      char: charToSplit,
    });
  } catch {
    texts = [text];
  }

  text = `${texts[0]}${texts.length > 1 ? append : ""}`;

  return {
    code: code.replaceLast(`$cropText${inside}`, text),
  };
};
