module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelType").length - 1;

  const after = code.split("$channelType")[r].after();

  if (after.inside) {
    const inside = after.inside;

    const channel = await d.util.getChannel(inside) 

    if (!channel)
      return d.error(d.aoiError.functionErrorResolve(d,"channel",{inside}));

    return {
      code: code.replaceLast(`$channelType${after}`, channel?.type),
    };
  } else {
    return {
      code: code.replaceLast(`$channelType`, d.message.channel?.type),
    };
  }
};
