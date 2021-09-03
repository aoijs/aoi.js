module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const [channelID, messageID,...reactions] = inside.splits;
  const channel = d.client.channels?.cache.get(channelID);
  if (!channel)
    return d.error(
      d.aoiError.functionErrorResolve(d,"channel",{inside})
    );
  const msg = await channel.messages.fetch(messageID).catch((err) => null);
  if (!msg)
    return d.error(
     d.aoiError.functionErrorResolve(d,"message",{inside})
    );
  for (const reaction of reactions) {
    const m = await msg.react(reaction.addBrackets()).catch((err) => null);
    if (!m) return d.error(`\`ReactionError: Failed To React With:\`'${reaction}'`);
  }
  return {
    code: code.replaceLast(`$addMessageReactions${inside.total}`, ""),
  };
};