module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$forEachChannel").length - 1;

  const inside = code.split("$forEachChannel")[r].after();

  for (const channel of d.client.channels.cache.array()) {
    for (const command of inside.splits) {
      const m = Object.assign(Object.create(d.message), d.message);

      m.channel = channel;

      const cmd = d.client.awaited_commands.find((e) => e.name === command);

      if (!cmd)
        return d.error(
          `❌ Invalid awaited command ${command} in \`$forEachChannel${inside}\``
        );

      d.interpreter(d.client, m, d.args, cmd);
    }
  }

  return {
    code: code.replaceLast(`$forEachChannel${inside}`, ""),
  };
};
