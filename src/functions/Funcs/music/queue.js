module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  const [page = 1, limit = 10, response = "[{title}]({url}) | <@{user.id}>"] =
    data.inside.splits;

  const player = d.client.voiceManager.players.get(d.guild?.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Bot Isn't Connected To Voice/Stage",
    );

  data.result = player.getQueue(page, limit, response).queue.join("\n");

  return {
    code: d.util.setCode(data),
  };
};
