const customFilters = {
  pitch(number) {
    return {
      atempo: 1.0,
      asetrate: 48000 * number,
      aresample: 48000 * number,
    };
  },
  volume(number = 100) {
    return {
      volume: number / 100,
    };
  },
  nightcore(number) {
    return {
      atempo: 1 * number,
      asetrate: 48000 * number,
      aresample: 48000,
    };
  },
};

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

  for (const f of Object.keys(filter)) {
    if (customFilters[f]) {
      filter = { ...filter, ...customFilters[f](filter[f]) };
      delete filter[f];
    }
  }

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

  data.result = JSON.stringify(
    await player.filterManager.addFilters(filter),
    null,
    2,
  );

  return {
    code: d.util.setCode(data),
  };
};
