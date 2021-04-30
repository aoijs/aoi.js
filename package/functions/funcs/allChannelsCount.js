module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$allChannelsCount").length - 1;

  const after = code.split("$allChannelsCount")[r].after();

  if (after.inside) {
    const types = after.splits;
    return {
      code: code.replaceLast(
        `$allChannelsCount${after.total}`,
        d.client.channels.cache.filter((ch) => types.includes(ch.type)).size
      ),
    };
  } else {
    return {
      code: code.replaceLast(`$allChannelsCount`, d.client.channels.cache.size),
    };
  }
};
