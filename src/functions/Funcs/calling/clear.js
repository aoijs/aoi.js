module.exports = async (d) => {
  const { code } = d.command;
  const inside = d.unpack();
  const err = d.inside(inside);
  if (err) return d.error(err);

  let [amt, filter = "everyone", returnCount = "no", channelId = d.channel.id] =
    inside.splits;

  amt = Number(amt);
  if (isNaN(amt))
    return d.aoiError.fnError(
      d,
      "custom",
      { inside },
      "Invalid Amout Provided In",
    );

  const channel = await d.util.getChannel(d, channelId);
  if (!channel) return d.aoiError.fnError(d, "channel", { inside });

  let messages = await channel.messages
    .fetch({ limit: 100, cache: false })
    .catch((err) => {
      d.aoiError.fnError(
        d,
        "custom",
        {},
        "Failed To Fetch Messages With Reason: " + err,
      );
    });

  messages = [...messages.filter((x) =>
    filter === "everyone"
      ? true
      : filter === "unPins"
      ? !x.pinned
      : filter === "bot"
      ? x.author?.bot
      : x.author?.id === filter,
  ).values()].slice(0,amt);

  let result = await channel.bulkDelete(messages, true).catch((err) => {
    d.aoiError.fnError(
      d,
      "custom",
      {},
      "Failed To Delete Message With Reason: " + err,
    );
  });
  result = returnCount === "yes" ? result.size : undefined;

  return {
    code: d.util.setCode({ function: d.func, code, inside, result }),
  };
};
