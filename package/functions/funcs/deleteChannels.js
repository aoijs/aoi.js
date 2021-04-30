module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$deleteChannels").length - 1;

  const inside = code.split("$deleteChannels")[r].after();

  for (const id of inside.splits) {
    const channel = d.message.guild.channels.cache.get(id);

    if (!channel)
      return d.error(`:x: Invalid channel ID in \`$deleteChannels${inside}\``);

    const del = await channel.delete().catch((err) => {});

    if (!del) return d.error(`:x: Failed to delete channel ${channel.name}!`);
  }

  return {
    code: code.replaceLast(`$deleteChannels${inside}`, ""),
  };
};
