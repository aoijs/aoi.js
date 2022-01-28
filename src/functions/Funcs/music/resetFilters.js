module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);
  player = d.client.voiceManager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Bot Is Not Connected To Voice/Stage.",
    );

  data.result = await player.filterManager.setFilters(filter);

  return {
    code: d.util.setCode(data),
  };
};
