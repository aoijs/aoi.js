module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$emojiCount`,
      d.message.guild.emojis.cache.size
    ),
  };
};
