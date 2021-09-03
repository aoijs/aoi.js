module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$emojiExists").length - 1;

  const inside = code.split("$emojiExists")[r].after();

  return {
    code: code.replaceLast(
      `$emojiExists${inside}`,
      d.client.emojis.cache.has(inside.inside)
    ),
  };
};
