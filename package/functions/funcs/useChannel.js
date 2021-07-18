const useChannel = async (d) => {
  const code = d.command.code;

  if (code.split("$useChannel").length >= 3)
    return d.message.channel.send(`\`${d.func}: Can't use more than one\``);

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  let channel = d.client.channels.cache.get(inside.inside);

  if (!channel)
    return d.error(`\`${d.func}: Invalid channel ID in ${inside}\``);

  return {
    channel: channel,
    code: code.replaceLast(`$useChannel${inside}`, ""),
  };
};

module.exports = useChannel;
