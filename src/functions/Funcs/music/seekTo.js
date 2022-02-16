const { Time } = require("../../../utils/helpers/customParser.js");

module.exports = async (d) => {
  const data = d.util.openFunc(d);

  let [number] = data.inside.splits;
  number = isNaN(number) ? Time.parse(number)?.ms : Number(number);
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

  player.filterManager.seekTo(Math.trunc(number / 1000));

  return {
    code: d.util.setCode(data),
  };
};
