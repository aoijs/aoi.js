module.exports = async (d) => {
  const data = d.util.openFunc(d);

  const [mode = "queue"] = data.inside.splits;

  if (!["song", "queue", "none"].includes(mode))
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "Invalid Type Provided In",
    );

  const player = d.client.voiceManager.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Bot Is Not Connected To Voice/Stage.",
    );

  player.loop(mode);

  return {
    code: d.util.setCode(data),
  };
};
