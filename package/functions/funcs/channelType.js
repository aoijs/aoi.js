module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelType").length - 1;

  const after = code.split("$channelType")[r].after();

  if (after.inside) {
    const inside = after.inside;

    const channel = d.client.channels.cache.get(inside);

    if (!channel)
      return d.error(`:x: Invalid channel ID in \`$channelType${after}\``);

    return {
      code: code.replaceLast(`$channelType${after}`, channel.type),
    };
  } else {
    return {
      code: code.replaceLast(`$channelType`, d.message.channel.type),
    };
  }
};
