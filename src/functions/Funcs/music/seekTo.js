const { Time } = require("../../../utils/helpers/customParser.js");

module.exports = async (d) => {
  const data = d.util.openFunc(d);

  let [number] = data.inside.splits;
  number = isNaN(number) ? Time.parse(number)?.ms : Number(number);
  if (isNaN(number))
    return d.aoiError.fnError(d, "custom", {}, "Invalid Number Provided In");

  const player = d.client.voiceManager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Client Is Not Connected To Voice/Stage.",
    );

  player.filterManager.seekTo(number);

  return {
    code: d.util.setCode(data),
  };
};
