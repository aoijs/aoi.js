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
      asubboost: `dry=0.7:wet=0.5`,
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

  const player = d.client.voiceManager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Client Is Not Connected To Voice/Stage.",
    );

  data.result = await player.filterManager.addFilters(filter);

  return {
    code: d.util.setCode(data),
  };
};
