module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$customEmoji").length - 1;

  const inside = code.split("$customEmoji")[r].after();

  return {
    code: code.replaceLast(
      `$customEmoji${inside}`,
      `${
        d.client.emojis.cache.find(
          (e) => e.name.toLowerCase() === inside.inside.toLowerCase()
        ) || ""
      }`
    ),
  };
};
