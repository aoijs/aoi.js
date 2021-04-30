//here u go
const embed = require("../../handlers/errors");
module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$closeTicket").length - 1;

  const inside = code.split("$closeTicket")[r].after();

  const exists = await d.client.db.get(
    "main",
    `ticket_${d.message.channel.id}`
  );

  if (!exists) return embed(d, inside);
  const channel = await d.message.channel.delete().catch((err) => null);

  if (!channel) return embed(d, inside);

  return {
    code: code.replaceLast(`$closeTicket${inside}`, ""),
  };
};
