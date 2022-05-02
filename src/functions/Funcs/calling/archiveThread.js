module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  const [threadId, channelId = d.channel.id, archive = "yes", reason] =
    data.inside.splits;
  const channel = await d.util.getChannel(d, channelId);
  if (!channel) return d.aoiError.fnError(d, "channel", { inside:data.inside });

  const thread = await channel.threads.fetch(threadId).catch((e) => {
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      `Failed To Fetch Thread With Reason : ${e.message}`,
    );
  });
  thread.setArchived(archive === "yes", reason?.addBrackets()).catch((e) => {
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      `Failed To Set Archive With Reason : ${e.message}`,
    );
  });

  return {
    code: d.util.setCode(data),
  };
};
