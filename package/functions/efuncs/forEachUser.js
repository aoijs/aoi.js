module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$forEachUser").length - 1;

  const inside = code.split("$forEachUser")[r].after();

  for (const user of d.client.users.cache.array()) {
    for (const command of inside.splits) {
      const m = Object.assign(Object.create(d.message), d.message);

      m.author = user;

      const cmd = d.client.awaited_commands.find((e) => e.name === command);

      if (!cmd)
        return d.error(
          `❌ Invalid awaited command ${command} in \`$forEachUser${inside}\``
        );

      d.interpreter(d.client, m, d.args, cmd);
    }
  }

  return {
    code: code.replaceLast(`$forEachUser${inside}`, ""),
  };
};
