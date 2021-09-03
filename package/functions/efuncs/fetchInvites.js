module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$fetchInvites").length - 1;

  const inside = code.split("$fetchInvites")[r].after();

  const invites = await d.message.guild.fetchInvites().catch((err) => null);

  if (!invites) return d.error(`❌ Could not fetch invites`);

  for (const invite of invites.array()) {
    for (const command of inside.splits) {
      const cmd = d.client.awaited_commands.find((c) => c.name === command);

      if (!cmd)
        return d.error(
          `❌ Invalid command ${command} in \`$fetchInvites${inside}\``
        );

      d.interpreter(
        d.client,
        d.message,
        d.args,
        cmd,
        undefined,
        undefined,
        undefined,
        {
          invite: invite,
        }
      );
    }
  }

  return {
    code: code.replaceLast(`$fetchInvites${inside}`, ""),
  };
};
