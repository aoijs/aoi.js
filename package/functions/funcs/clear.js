module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$clear").length - 1;

  const inside = code.split("$clear")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [
    amount,
    filter = "everyone",
    channelID = d.message.channel.id,
    returnCount = "no",
  ] = inside.splits;

  const channel = d.message.guild.channels.cache.get(channelID);

  if (!channel) return d.error(`:x: Invalid channel ID in \`$clear${inside}\``);

  let input = Number(amount);
  let deleteds = 0;

  while (input > 0) {
    const data = Math.min(input, 100);

    input -= data;

    const messages = await channel.messages
      .fetch({
        limit: data,
        cache: false,
      })
      .catch((err) => null);

    if (!messages) return d.error(":x: Failed to fetch messages");

    if (messages.size <= 0) break;

    const deleted = await channel
      .bulkDelete(
        filter === "everyone"
          ? messages
          : messages.filter((m) => m.author.id === filter),
        true
      )
      .catch((err) => null);

    if (!deleted) return d.error(":x: Failed to delete messages");

    if (deleted.size <= 0) break;

    deleteds += deleted.size;

    if (input > 0) await new Promise((res) => setTimeout(res, 3000));
  }

  return {
    code: code.replaceLast(
      `$clear${inside}`,
      returnCount === "yes" ? deleteds : ""
    ),
  };
};
