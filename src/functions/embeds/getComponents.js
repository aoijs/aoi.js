/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [channelID = d.channel?.id, messageID = d.message?.id] = data.inside.splits;

  if (!messageID) {
    return d.aoiError.fnError(
      d,
      "message",
      { inside: data.inside },
    );
  }

  const channel = d.util.getChannel(channelID);
 if (!channel) {
    return d.aoiError.fnError(
      d,
      "channel",
      { inside: data.inside },
    );
  }

  let msg;
  try {
    msg = await channel.messages.fetch(messageID);
  } catch {
    return d.aoiError.fnError(
      d,
      "message",
      { inside: data.inside },
    );

  if (!msg.components?.length) {
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "The message does not contain any components."
    );
  }

  const rawComponents = msg.components.map(row => ({
    type: 1,
    components: row.components.map(comp => comp.toJSON())
  }));

  data.result = JSON.stringify(rawComponents, null, 2);
  return {
    code: d.util.setCode(data)
  };
};
