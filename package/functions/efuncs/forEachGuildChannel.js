module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$forEachGuildChannel").length - 1;

  const inside = code.split("$forEachGuildChannel")[r].after();

  for (const channel of d.message.guild.channels.cache.array()) {
    for (const command of inside.splits) {
      const m = Object.assign(Object.create(d.message), d.message);

      m.channel = channel;

      const cmd = d.client.awaited_commands.find((e) => e.name === command);

      if (!cmd)
        return d.error(
          `❌ Invalid awaited command ${command} in \`$forEachGuildChannel${inside}\``
        );

      d.interpreter(d.client, m, d.args, cmd);
    }
  }

  return {
    code: code.replaceLast(`$forEachGuildChannel${inside}`, ""),
  };
};
