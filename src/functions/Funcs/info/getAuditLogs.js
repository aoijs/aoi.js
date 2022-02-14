module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  let [
    limit = 5,
    userId = d.author?.id,
    action = "All",
    guildId = d.guild?.id,
    format = "{executor.username}: {target.id} - {action}",
  ] = data.inside.splits;

  const guild = await d.util.getGuild(d, guildId);
  if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

  limit = Number(limit);
  if (isNaN(limit))
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "Invalid Index Provided In",
    );

  const audit = await guild
    .fetchAuditLogs({
      limit,
      user: userId === "" ? undefined : userId,
      type: action,
    })
    .catch((e) => {
      d.aoiError.fnError(
        d,
        "custom",
        {},
        "Failed To Get Audit Logs With Reason: " + e,
      );
    });

  data.result = audit.entries
    .map((logs) =>
      format
        .replaceAll(`{executor.username}`, logs.executor.username)
        .replaceAll(`{executor.mention}`, logs.executor)
        .replaceAll(`{executor.id}`, logs.executor.id)
        .replaceAll(`{executor.tag}`, logs.executor.tag)
        .replaceAll("{target.id}", logs.id)
        .replaceAll("{action}", logs.action),
    )
    .join("\n");

  return {
    code: d.util.setCode(data),
  };
};
