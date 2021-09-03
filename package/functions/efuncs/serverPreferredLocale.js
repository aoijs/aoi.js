module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$serverPreferredLocale").length - 1;

  const data = code.split("$serverPreferredLocale")[r].after();

  const [guildID = d.message.guild.id] = data.splits;

  const guild = d.client.guilds.cache.get(guildID);

  if (!guild)
    return d.error(
      `❌ Invalid guild ID in \`$serverPreferredLocale${data.total}\``
    );

  return {
    code: code.replaceLast(
      `$serverPreferredLocale${data.total}`,
      guild.preferredLocale
    ),
  };
};
