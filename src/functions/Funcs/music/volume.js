module.exports = async (d) => {
  const data = d.util.openFunc(d);

  let [volume = "getVolume"] = data.inside.splits;
  if (isNaN(volume) && volume !== "getVolume")
    return d.aoiError.fnError(d, "custom", {}, "Invalid Number Provided");

  const player = d.client.voiceManager.players.get(d.guild?.id);

  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Client Is Not Connected To Voice/Stage.",
    );
if(volume === "getVolume") player.currentStream.volume.volume * 100;
  else player.requestUser._setVolume(Number(volume)/100);

  return {
    code: d.util.setCode(data),
  };
};
