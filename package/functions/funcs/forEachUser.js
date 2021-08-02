module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$forEachUser").length - 1;

  const inside = code.split("$forEachUser")[r].after();

  for (const user of d.client.users.cache.array()) {
    for (const command of inside.splits) {
      const cmd = d.client.awaited_commands.find((e) => e.name === command);

      if (!cmd)
        return d.error(
          `\`${d.func}: Invalid awaited command ${command} in ${inside}\``
        );
d.interpreter(d.client,{
     message:d.message,
     channel:d.channel,
     guild: d.guild,
     author:user,
     client:d.client
      }, d.args, cmd);
    }
  }

  return {
    code: code.replaceLast(`$forEachUser${inside}`, ""),
  };
};
