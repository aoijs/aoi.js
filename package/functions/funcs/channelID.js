const channelID = async (d) => {
  let code = d.command.code;

  const r = code.split("$channelID").length - 1;

  const after = code.split("$channelID")[r].after();

  if (after.inside) {
    const inside = after.inside;

    const channel = d.client.channels.cache.find((c) => c.name === inside);

    if (!channel)
      return d.error(`:x: Invalid channel name in \`$channelID${after}\``);

    code = code.replaceLast(`$channelID${after}`, channel.id);
  } else {
    code = code.replaceLast("$channelID", d.message.channel.id);
  }

  return {
    code: code,
  };
};

module.exports = channelID;
