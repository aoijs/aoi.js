module.exports = async (d) => {
  const data = d.util.openFunc(d);

  if (!d.client.voiceManager)
    return d.aoiError.fnError(d, "custom", {}, "Voice Class Not Initialized");

  const player = d.client.voiceManager.manager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Bot Isn't Connected to Voice/Stage",
    );

  player.shuffleQueue();

  return {
    code: d.util.setCode(data),
  };
};
