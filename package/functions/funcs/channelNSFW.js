module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelNSFW").length - 1;

  const after = code.split("$channelNSFW")[r].after();

  if (after.inside) {
    const id = after.inside;

    const channel =await d.util.getChannel(id)

    if (!channel)
      return d.error(d.aoiError.functionErrorResolve(d,"channel",{inside}));

    return {
      code: code.replaceLast(`$channelNSFW${after}`, channel?.nsfw),
    };
  } else {
    return {
      code: code.replaceLast(`$channelNSFW`, d.channel?.nsfw??""),
    };
  }
};
