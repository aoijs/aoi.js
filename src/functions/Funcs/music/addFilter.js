module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  let [filter] = data.inside.splits;

  try {
    filter = JSON.parse(filter);
  } catch (_) {
    return d.aoiError.fnError(
      d,
      "custom",
      {
        inside: data.inside,
      },
      "Invalid Filter Provided In",
    );
  }

  const player = d.client.voiceManager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Client Is Not Connected To Voice/Stage.",
    );

  data.result = await player.filterManager.addFilters(filter);

  return {
    code: d.util.setCode(data),
  };
};
