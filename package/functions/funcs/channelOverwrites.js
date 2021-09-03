module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelOverwrites").length - 1;

  const data = code.split("$channelOverwrites")[r].after();

  const def =
    "{mention} ({type}):\nAllowed Perms: {allow}\nDenied Perms: {deny}";

  if (!data.splits.length) {
    data.splits.push(d.message.channel.id, def);
  }

  const [channelID, column = def, separator = "\n"] = data.splits;

  const channel = d.client.channels.cache.get(channelID);

  if (!channel)
    return d.error(
      `❌ Invalid channel ID in \`$channelOverwrites${data.total}\``
    );

  const placer = channel.permissionOverwrites
    .array()
    .map((overwrites) => {
      return column
        .replace(/{allow}/g, overwrites.allow.toArray().goof())
        .replace(/{deny}/g, overwrites.deny.toArray().goof())
        .replace(
          /{mention}/g,
          overwrites.type === "role"
            ? `<@&${overwrites.id}>`
            : `<@${overwrites.id}>`
        )
        .replace(/{type}/g, overwrites.type);
    })
    .join(separator);

  return {
    code: code.replaceLast(`$channelOverwrites${data.total}`, placer),
  };
};
