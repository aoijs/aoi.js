module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$forEachMember").length - 1;

  const inside = code.split("$forEachMember")[r].after();

  for (const member of d.message.guild.members.cache.array()) {
    for (const command of inside.splits) {
      const cmd = d.client.awaited_commands.find((e) => e.name === command);

      if (!cmd)
        return d.error(
          `\`${d.func}: Invalid awaited command ${command} in ${inside}\``
        );

d.interpreter(d.client,{
     message:d.message,
     channel: d.channel,
     guild: d.guild,
     author:member.user,
     member:member,
     client:d.client
      }, d.args, cmd);
    }
  }

  return {
    code: code.replaceLast(`$forEachMember${inside}`, ""),
  };
};
