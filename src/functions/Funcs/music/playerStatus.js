module.exports = async (d) => {
  const data = d.util.openFunc(d);

  if (!d.client.voiceManager)
    d.aoiError.fnError(d, "custom", {}, "Voice class is not Initialized");

  const player = d.client.voiceManager.manager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(d, "custom", {}, "Bot is not in Voice/Stage");

  data.result = player.player._state.status;

  return {
    code: d.util.setCode(data),
  };
};
