module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$commandsCount`,
      d.client.bot_commands.size
    ),
  };
};
