module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$channelCategoryID").length - 1;

  const after = code.split("$channelCategoryID")[r].after();

  if (after.inside) {
    const inside = after.inside;

    const channel = d.message.guild.channels.cache.get(inside);

    if (!channel)
      return d.error(
        `❌ Invalid channel ID in \`$channelCategoryID${inside}\``
      );

    return {
      code: code.replaceLast(
        `$channelCategoryID${after}`,
        channel.parentID || ""
      ),
    };
  } else {
    return {
      code: code.replaceLast(
        `$channelCategoryID`,
        d.message.channel.parentID || ""
      ),
    };
  }
};
