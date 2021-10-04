module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelNSFW").length - 1;

  const after = code.split("$channelNSFW")[r].after();

  if (after.inside) {
    const id = after.inside;

    const channel = d.message.guild.channels.cache.get(id);

    if (!channel)
      return d.error(`:x: Invalid channel ID \`$channelNSFW${after}\``);

    return {
      code: code.replaceLast(`$channelNSFW${after}`, channel.nsfw),
    };
  } else {
    return {
      code: code.replaceLast(`$channelNSFW`, d.message.channel.nsfw),
    };
  }
};
