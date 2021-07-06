module.exports = async (d) => {
  const server = d.client.servers.get(d.message.guild.id);

  if (!server) return d.error(`\`Nothing is currently being played!\``);

  d.client.servers.delete(d.message.guild.id);

  return {
    code: d.command.code.replaceLast(`$clearSongQueue`, ""),
  };
};
