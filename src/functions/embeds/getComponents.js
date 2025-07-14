/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [channelID = d.channel?.id, messageID] = data.inside.splits;

  if (!messageID) {
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "You must provide the message ID."
    );
  }

  const channel = d.client.channels.cache.get(channelID);
  if (!channel) {
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      `Channel with ID "${channelID}" was not found.`
    );
  }

  let msg;
  try {
    msg = await channel.messages.fetch(messageID);
  } catch {
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      `Failed to fetch message with ID "${messageID}".`
    );
  }

  if (!msg.components?.length) {
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
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
