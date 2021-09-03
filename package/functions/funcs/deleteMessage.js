module.exports = async (d) => {
  const code = d.command.code;



  const inside = d.unpack() 

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const messageID = fields[1] || fields[0];

  const channelID = fields[1] ? fields[0] : d.message.channel.id;

  const channel = await d.util.getChannel(d,channelID) 

  if (!channel)
    return d.error(d.aoiError.functionErrorResolve(d,"channel",{inside}));

  const m = await d.util.getMessage(channel,messageID) 

  if (!m)
    return d.error(d.aoiError.functionErrorResolve(d,"message",{inside}));

  await m.delete().catch((err) => null);

  return {
    code: code.replaceLast(`$deleteMessage${inside}`, ""),
  };
};
