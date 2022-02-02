module.exports = async (d) => {
  const data = d.util.openFunc(d);

  const player = d.client.voiceManager.players.get(d.guild?.id);

  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Client Is Not Connected To Voice/Stage.",
    );

  player._defaultOptions();

  return {
    code: d.util.setCode(data),
  };
};
