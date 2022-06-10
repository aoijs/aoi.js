module.exports = async (d) => {
  const data = d.util.aoiFunc(d);

  let [volume = "getVolume"] = data.inside.splits;
  if (isNaN(volume) && volume !== "getVolume")
    return d.aoiError.fnError(d, "custom", {}, "Invalid Number Provided");

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
  if (volume === "getVolume")
    data.result =
      (player.requestManager.currentStream?.volume.volume || 0) * 100;
  else player.requestManager._setVolume(Number(volume) / 100);

  return {
    code: d.util.setCode(data),
  };
};
