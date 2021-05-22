module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$lastPinTimestamp").length - 1;

  const after = code.split("lastPinTimestamp")[r].after();

  if (after.inside) {
    const inside = after.inside;

    const channel = d.message.guild.channels.cache.get(inside);

    if (!channel)
      return d.error(`:x: Invalid channel ID in \`$lastPinTimestamp${after}\``);

    return {
      code: code.replaceLast(
        `$lastPinTimestamp${after}`,
        (channel.lastPinTimestamp)
      ),
    };
  } else {
    return {
      code: code.replaceLast(
        `$lastPinTimestamp`,
        (d.message.channel.lastPinTimestamp)
      ),
    };
  }
};
