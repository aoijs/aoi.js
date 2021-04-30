module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$allEmojiCount`,
      d.client.emojis.cache.size
    ),
  };
};
