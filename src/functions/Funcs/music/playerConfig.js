const { Time } = require("../../../utils/helpers/customParser.js");

module.exports = async (d) => {
  const data = d.util.openFunc(d);

  const [leaveWhenDone = "no",leaveWhenDoneAfter = 60000,seekWhenFilter = "no",] = data.inside.splits;

  if (!d.client.voiceManager)
    return d.aoiError.fnError(d, "custom", {}, "Voice Class Not Initialized");

  const player = d.client.voiceManager.manager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Bot Isn't Connected to Voice/Stage",
    );
  d.client.voiceManager.manager.players.get(d.guild?.id).options.leaveAfter = {
    enabled: leaveWhenDone === "yes",
    time: Time.parse(leaveWhenDoneAfter)?.ms,
  };
  d.client.voiceManager.manager.players.get(
    d.guild?.id,
  ).options.seekWhenFilter = seekWhenFilter === "yes";
  
  return {
    code: d.util.setCode(data),
  };
};
