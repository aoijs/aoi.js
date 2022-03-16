module.exports = async (d) => {
  const data = d.util.openFunc(d);

  const [id = d.guild?.id] = data.inside.splits;

  if (!d.client.voiceManager)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Voice Class Is Not Initialised.",
    );

  data.result = d.client.voiceManager.manager.players.has(id);

  return {
    code: d.util.setCode(data),
  };
};
