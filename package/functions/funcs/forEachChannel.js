module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  for (const channel of d.client.channels.cache.array()) {
    for (const command of inside.splits) {
      const cmd = d.client.awaited_commands.find((e) => e.name === command);
      if (!cmd)
        return d.error(
          `\`${d.func}: Invalid awaited command ${command} in ${inside}\``
        );
      d.interpreter(d.client,{
     message:d.message,
     channel: channel,
     guild: channel.guild,
     author:d.author,
     member:d.member,
     client:d.client
      }, d.args, cmd);
    }
  }

  return {
    code: code.replaceLast(`$forEachChannel${inside}`, ""),
  };
};
