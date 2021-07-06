module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$clearReactions").length - 1;

  const inside = code.split("$clearReactions")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [channelID, messageID, emojiOptions = "all"] = inside.splits;

  const channel = d.client.channels.cache.get(channelID);

  if (!channel)
    return d.error(`\`${d.func}: Invalid channel ID in ${inside}\``);

  const msg = await channel.messages.fetch(messageID).catch((err) => null);

  if (!msg)
    return d.error(`\`${d.func}: Invalid message ID in ${inside}\``);

  if (emojiOptions === "all") {
    await msg.reactions.removeAll().catch((err) => null);
  } else {
    const emoji = emojiOptions.includes("<")
      ? emojiOptions.split(":")[2].split(">")[0]
      : emojiOptions;

    try {
      await msg.reactions.cache.get(emoji).remove();
    } catch (err) {
      return {
        code: code.replaceLast(`$clearReactions${inside}`, ""),
      };
    }
  }

  return {
    code: code.replaceLast(`$clearReactions${inside}`, ""),
  };
};
