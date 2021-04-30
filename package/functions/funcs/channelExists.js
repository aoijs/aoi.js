module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelExists").length - 1;

  const inside = code.split("$channelExists")[r].after();

  const channel = d.client.channels.cache.get(inside.inside);

  return {
    code: code.replaceLast(`$channelExists${inside}`, channel ? true : false),
  };
};
