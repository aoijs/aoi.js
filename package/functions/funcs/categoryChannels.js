module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$categoryChannels").length - 1;

  const inside = code.split("$categoryChannels")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [channelID, opt = "name", separator = ", "] = inside.splits;

  const channel = d.client.channels.cache.get(channelID);

  if (!channel)
    return d.error(`❌ Invalid channel ID in \`$categoryChannels${inside}\``);

  if (channel.type !== "category")
    return d.error(`❌ This channel is not a category! `);

  return {
    code: code.replaceLast(
      `$categoryChannels${inside}`,
      opt === "count"
        ? channel.children.size
        : opt === "mention"
        ? channel.children
            .map((a) => a.toString())
            .join(separator)
            .deleteBrackets()
        : channel.children
            .map((c) => c[opt] || "")
            .join(separator)
            .deleteBrackets()
    ),
  };
};
