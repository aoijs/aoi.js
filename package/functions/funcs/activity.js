module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$activity").length - 1;

  const after = code.split("$activity")[r].after();

  if (after.inside) {
    const id = after.inside;

    const u = await d.client.users.fetch(id).catch((err) => {});

    if (!u) return d.error(`\`${d.func}: Invalid user ID in ${after.total}\``);

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
