module.exports = async (d) => {
  const code = d.command.code;
  const after = d.unpack() 
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
    await d.guild.leave();
    return {
      code: code.replaceLast(`$botLeave`, ""),
    };
  }
};
