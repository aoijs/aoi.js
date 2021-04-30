function deleteQueue(client, oldState, newState) {
  const server = client.servers.get(newState.guild.id);
  if (!server) return;
  return client.servers.delete(newState.guild.id);
}

module.exports = async (client, oldState, newState) => {
  if (newState.id !== client.user.id) return;
  if (oldState.channel && !newState.channel) {
    deleteQueue(client, oldState, newState);
  } else return;
};
