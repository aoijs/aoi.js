module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelCount").length - 1;

  const after = code.split("$channelCount")[r].after();

  if (after.inside) {
    const inside = after.inside;

    return {
      code: code.replaceLast(
        `$channelCount${after}`,
        d.message.guild.channels.cache.filter((c) =>
          inside.split(";").includes(c.type)
        ).size
      ),
    };
  } else {
    return {
      code: code.replaceLast(
        `$channelCount`,
        d.message.guild.channels.cache.size
      ),
    };
  }
};
