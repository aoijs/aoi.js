module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();

  if (!d.inside(inside)) {
    const guildID = inside.inside;

    const guild = d.client.guilds.cache.get(guildID);

    if (!guild)
      return d.error(
        `:x: Invalid guild ID in \`$defaultMessageNotifications${inside}\``
      );

    return {
      code: code.replaceLast(
        `$defaultMessageNotifications${inside}`,
        guild.defaultMessageNotifications
          .split("_")
          .map((word) =>
            word.toLowerCase().replace(word.toLowerCase()[0], word[0])
          )
          .join(" ")
      ),
    };
  } else {
    return {
      code: code.replaceLast(
        `$defaultMessageNotifications`,
        d.message.guild.defaultMessageNotifications
          .split("_")
          .map((word) =>
            word.toLowerCase().replace(word.toLowerCase()[0], word[0])
          )
          .join(" ")
      ),
    };
  }
};
