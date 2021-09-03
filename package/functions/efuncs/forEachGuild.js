module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$forEachGuild").length - 1;

  const inside = code.split("$forEachGuild")[r].after();

  for (const guild of d.client.guilds.cache.array()) {
    for (const command of inside.splits) {
      const m = Object.assign(Object.create(d.message), d.message);

      m.guild = guild;

      const cmd = d.client.awaited_commands.find((e) => e.name === command);

      if (!cmd)
        return d.error(
          `❌ Invalid awaited command ${command} in \`$forEachGuild${inside}\``
        );

      d.interpreter(d.client, m, d.args, cmd);
    }
  }

  return {
    code: code.replaceLast(`$forEachGuild${inside}`, ""),
  };
};
