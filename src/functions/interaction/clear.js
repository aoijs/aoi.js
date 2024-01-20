module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  const { code } = d.command;
  if (data.err) return d.error(data.err);

  let [channelID = d.channel.id, amount, filters = "everyone", returnCount = "false" ] = data.inside.splits;

  if (isNaN(amount)) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Amount Provided In" );

  amount = Number(amount) + 1

  const channel = await d.util.getChannel(d, channelID);
  if (!channel) return d.aoiError.fnError(d, "channel", { inside: data.inside });

  let messages = await channel.messages
    .fetch({ limit: amount, cache: true })
    .catch((err) => {
      d.aoiError.fnError(d, "custom", {}, "Failed To Fetch Messages With Reason: " + err);
    });

  filters = filters.toLowerCase().split(",");

  messages = [...messages.values()]
    .filter((x) => {
      if (filters.includes("")) return true;
      if (filters.includes("everyone")) return true;
      if (filters.includes("unpinned") && !x.pinned) return true;
      if (filters.includes("bots") && x.author?.bot) return true;
      if (
        filters.some(
          (filter) =>
            filter.startsWith("user:") && x.author?.id === filter.split(":")[1]
        )
      )
        return true;
      return false;
    })
    .slice(0, amount);

  if (!messages.length) {
    messages = [...messages.values()].slice(0, amount);
  }

  let result = await channel.bulkDelete(messages, true).catch((err) => {
    d.aoiError.fnError(d, "custom" ,{}, "Failed To Delete Message With Reason: " + err);
  });

  result = returnCount === "true" ? messages.length - 1 : undefined;

  return {
    code: d.util.setCode({ function: d.func, code, inside: data.inside, result }),
  };
};
