module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$activity").length - 1;

  const after = code.split("$activity")[r].after();

  if (after.inside) {
    const id = after.inside;

    const u = await d.client.users.fetch(id).catch((err) => {});

    if (!u) return d.error(`❌ Invalid user ID in \`$activity${after.total}\``);

    if (!u.presence.activities)
      return d.error(`❌ No activities for \`$activity${after.total}\``);

    return {
      code: code.replaceLast(
        `$activity${after.total}`,
        u.presence.activities.join(", ").deleteBrackets() || "none"
      ),
    };
  } else {
    return {
      code: code.replaceLast(
        `$activity`,
        d.message.author.presence.activities.join(", ").deleteBrackets() ||
          "none"
      ),
    };
  }
};
