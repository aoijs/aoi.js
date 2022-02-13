const { Time } = require("../../../utils/helpers/customParser.js");

module.exports = async (d) => {
  const data = d.util.openFunc(d);

  const [
    leaveWhenVCEmpty = "no",
    leaveWhenDone = "no",
    leaveWhenDoneAfter = 60000,
  ] = data.inside.splits;

  if (!d.client.voiceManager)
    return d.aoiError.fnError(d, "custom", {}, "Voice Class Not Initialized");

  const player = d.client.voiceManager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Bot Isn't Connected to Voice/Stage",
    );
  player.options.leaveWhenVCEmpty = leaveWhenVCEmpty === "yes";
  player.options.leaveAfter = {
    enabled: leaveWhenDone === "yes",
    time: Time.parse(leaveWhenDoneAfter)?.ms,
  };

  return {
    code: d.util.setCode(data),
  };
};
