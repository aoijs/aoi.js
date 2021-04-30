const embed = require("../../handlers/errors");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [name, msg, categoryID, returnID = "no", error] = inside.splits;

  const channel = await d.message.guild.channels
    .create(name, {
      parent: categoryID || undefined,
    })
    .catch((err) => null);

  if (!channel) return embed(d, error);

  await d.client.db.set("main", `ticket_${channel.id}`, "open");

  await channel
    .updateOverwrite(d.message.author.id, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
      READ_MESSAGE_HISTORY: true,
    })
    .catch((err) => null);

  if (msg) {
    const copy = Object.assign(Object.create(d), d);

    copy.channel = channel;
    copy.message.channel = channel;

    embed(copy, msg);
  }

  return {
    code: code.replaceLast(
      `$newTicket${inside}`,
      returnID === "yes" ? channel.id : ""
    ),
  };
};
