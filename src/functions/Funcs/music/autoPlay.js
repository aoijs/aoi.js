module.exports = async (d) => {
  const data = d.util.aoiFunc(d);

  if (data.err) return d.error(data.err);

  const [type] = data.inside.splits;

  if (!["soundcloud", "relative", "youtube"].includes(type))
    return d.aoiError.fnError(
      d,
      "custom",
      {
        inside: data.inside,
      },
      "Invalid Type Provided In",
    );

    if (!d.client.voiceManager)
      return d.aoiError.fnError(
        d,
        "custom",
        {},
        "Voice Class Is Not Initialised.",
      );

  const player = d.client.voiceManager.manager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Client is not connected to Voice/Stage.",
    );

  player.options.autoPlay = type;

  return {
    code: d.util.setCode(data),
  };
};
