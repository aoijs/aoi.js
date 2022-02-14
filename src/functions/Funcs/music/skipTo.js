/**
 * @param  {} d
 * @returns {Promise<{code: string}>}
 */
module.exports = async (d) => {
  const data = d.util.openFunc(d);

  let [number] = data.inside.splits;
  number = Number(number);
  if (isNaN(number))
    return d.aoiError.fnError(d, "custom", {}, "Invalid Number Provided In");

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
      "Client Is Not Connected To Voice/Stage.",
    );

  player.skipTo(number);

  return {
    code: d.util.setCode(data),
  };
};
