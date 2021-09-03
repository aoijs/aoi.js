module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$forEachMember").length - 1;

  const inside = code.split("$forEachMember")[r].after();

  for (const member of d.message.guild.members.cache.array()) {
    for (const command of inside.splits) {
      const m = Object.assign(Object.create(d.message), d.message);

      m.author = member.user;

      m.member = member;

      const cmd = d.client.awaited_commands.find((e) => e.name === command);

      if (!cmd)
        return d.error(
          `❌ Invalid awaited command ${command} in \`$forEachMember${inside}\``
        );

      d.interpreter(d.client, m, d.args, cmd);
    }
  }

  return {
    code: code.replaceLast(`$forEachMember${inside}`, ""),
  };
};
