module.exports = async (d) => {
  const code = d.command.code;

  const bans = await d.message.guild.fetchBans().catch((err) => {});

  return {
    code: code.replaceLast(
      `$banCount`,
      bans ? bans.size : "missing permissions"
    ),
  };
};
