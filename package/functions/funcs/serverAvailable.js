module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$serverAvailable").length - 1;

  const data = code.split("$serverAvailable")[r].after();

  const guild = d.client.guilds.cache.get(
    data.inside || (d.message.guild ? d.message.guild.id : undefined)
  );

  if (!guild)
    return d.error(`❌ Invalid guild ID in \`$serverAvailable${data.total}\``);

  return {
    code: code.replaceLast(`$serverAvailable${data.total}`, guild.available),
  };
};
