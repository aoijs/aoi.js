module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();

  const options = [
    emoji,
    guildID
  ] = inside.splits

  var find;

  if (guildID) {
    let guild = d.client.guilds.cache.get(guildID)

    if (!guild) return d.error(`:x: Invalid guild ID in \`$customEmoji${inside}\``)

    find = guild.emojis.cache.find((e) => e.name.toLowerCase() === emoji.toLowerCase())

   // if (!find) return d.error(`:x: Invalid emoji name in \`$customEmoji${inside}\``)
  } else {
    find = d.client.emojis.cache.find((e) => e.name.toLowerCase() === emoji.toLowerCase())

    //if (!find) return d.error(`:x: Invalid emoji name in \`$customEmoji${inside}\``)
  }

  return {
    code: code.replaceLast(
      `$customEmoji${inside}`,
      find.toString() || ""
    ),
  };
};
