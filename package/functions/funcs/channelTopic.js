module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelTopic").length - 1;

  const after = code.split("$channelTopic")[r].after();

  if (after.inside) {
    const inside = after.inside;

    const channel = await d.util.getChannel(after.inside) 
    if (!channel)
      return d.error(d.aoiError.functionErrorResolve(d,"channel",{inside}));

    return {
      code: code.replaceLast(
        `$channelTopic${after}`,
        (channel?.topic ?? "none")?.removeBrackets()
      ),
    };
  } else {
    return {
      code: code.replaceLast(
        `$channelTopic`,
        (d.message.channel?.topic ?? "none")?.removeBrackets()
      ),
    };
  }
};
