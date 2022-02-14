module.exports = async (d) => {
  const data = d.util.openFunc(d);

  const manager = d.client.voiceManager?.manager.players.get(d.guild?.id);

  data.result = manager ? manager.queue.list.length : 0;

  return {
    code: d.util.setCode(data),
  };
};
