const embed = require("../../handlers/errors.js");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$editMessage").length - 1;

  const inside = code.split("$editMessage")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [messageID, msg, channelID = d.message.channel.id] = inside.splits;

  const channel = d.client.channels.cache.get(channelID);

  if (!channel)
    return d.error(`❌ Invalid channel ID in \`$editMessage${inside}\``);

  const message = await channel.messages.fetch(messageID).catch((err) => {});

  if (!message)
    return d.error(`❌ Invalid message ID in \`$editMessage${inside}\``);

  if (message.author.id !== d.client.user.id)
    return d.error(`❌ Unauthored message!`);

  const m = await embed(d, msg.addBrackets(), true);

  await message.edit(m.message, m.embed);

  return {
    code: code.replaceLast(`$editMessage${inside}`, ""),
  };
};
