module.exports = async (d) => {
  const data = d.util.openFunc(d);

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

  const player = d.client.voiceManager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Client Is Not Connected To Voice/Stage.",
    );

  player.options.autoPlay = type;

  return {
    code: d.util.setCode(data),
  };
};
