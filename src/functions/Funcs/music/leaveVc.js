module.exports = async (d) => {
  const data = d.util.openFunc(d);

  const [channelId = d.member?.voice?.channelId] = data.inside.splits;

  const player = d.client.voiceManager.manager.players.get(d.guild?.id);

  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Client Is Not Connected To Voice/Stage.",
    );

  player.leaveVc();

  return {
    code: d.util.setCode(data),
  };
};
