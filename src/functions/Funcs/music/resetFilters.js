module.exports = async (d) => {
  const data = d.util.openFunc(d);
  player = d.client.voiceManager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Client Is Not Connected To Voice/Stage.",
    );

  data.result = await player.filterManager.resetFilters();

  return {
    code: d.util.setCode(data),
  };
};
