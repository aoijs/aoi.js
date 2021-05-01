module.exports = async (d) => {
  const message = d.message;

  return {
    code: d.command.code.replaceLast(
      `$mentionedChannelsCount`,
      message ? message.mentions.channels.size : 0
    ),
  };
};
