module.exports = (d) => {
  const code = d.command.code;

  const inside = d.unpack();

  if (inside.inside) {
    const options = ([
      guildID = d.message.guild.id,
      presence = "all",
      countBots = "yes",
    ] = inside.splits);

    const guild = d.client.guilds.cache.get(guildID || d.message.guild.id);

    if (!guild)
      return d.error(`:x: Invalid guild ID in \`$membersCount${inside}\``);

    return {
      code: code.replaceLast(
        `$membersCount${inside}`,
        guild.members.cache
          .filter((m) => (countBots === "yes" ? true : m.user.bot === false))
          .filter((m) =>
            presence === "all"
              ? true
              : presence.toLowerCase() === m.presence.status
          ).size
      ),
    };
  } else {
    return {
      code: d.command.code.replaceLast(
        "$membersCount",
        d.message.guild.memberCount
      ),
    };
  }
};
