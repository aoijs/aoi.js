module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$botLeave").length - 1;

  const after = code.split("$botLeave")[r].after();

  if (after.inside) {
    const inside = after.inside;

    const guild = d.client.guilds.cache.get(inside);

    if (!guild)
      return d.error(`:x: Invalid guild ID in \`$botleave${inside}\``);

    await guild.leave();

    return {
      code: code.replaceLast(`$botLeave${after}`, ""),
    };
  } else {
    await d.message.guild.leave();

    return {
      code: code.replaceLast(`$botLeave`, ""),
    };
  }
};
