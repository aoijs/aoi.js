module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelTopic").length - 1;

  const after = code.split("$channelTopic")[r].after();

  if (after.inside) {
    const inside = after.inside;

    const channel = d.message.guild.channels.cache.get(inside);

    if (!channel)
      return d.error(`:x: Invalid channel ID in \`$channelTopic${after}\``);

    return {
      code: code.replaceLast(
        `$channelTopic${after}`,
        (channel.topic || "none").removeBrackets()
      ),
    };
  } else {
    return {
      code: code.replaceLast(
        `$channelTopic`,
        (d.message.channel.topic || "none").removeBrackets()
      ),
    };
  }
};
