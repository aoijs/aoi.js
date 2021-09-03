module.exports = async (d) => {
  const code = d.command.code;
  const after = d.unpack();
  if (after.inside) {
    const types = after.splits;
    return {
      code: code.replaceLast(
        `$allChannelsCount${after.total}`,
        d.client?.channels?.cache.filter((ch) => types.includes(ch.type)).size
      ),
    };
  } else {
    return {
      code: code.replaceLast(`$allChannelsCount`, d.client?.channels?.cache.size),
    };
  }
};