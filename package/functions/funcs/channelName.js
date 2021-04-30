module.exports = (d) => {
  const code = d.command.code;

  const r = code.split("$channelName").length - 1;

  const after = code.split("$channelName")[r].after();

  //this one is more complex
  if (after.inside) {
    const id = after.inside;

    const channel = d.message.guild.channels.cache.get(id.addBrackets());

    if (!channel)
      return d.error(`❌ Invalid channel ID in \`$channelName${after}\``);

    return {
      code: code.replaceLast(
        `$channelName${after}`,
        channel.name.deleteBrackets()
      ),
    };
  } else {
    return {
      code: code.replaceLast(
        "$channelName",
        d.message.channel.name.deleteBrackets()
      ),
    };
  }
};
