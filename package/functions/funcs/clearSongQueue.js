module.exports = async (d) => {
  const server = d.client.servers.get(d.message.guild.id);

  if (!server) return d.error(`${d.func}: Nothing is being played!`);

  server.queue = [] 

  return {
    code: d.command.code.replaceLast(`$clearSongQueue`, ""),
  };
};
