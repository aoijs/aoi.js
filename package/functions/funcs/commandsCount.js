module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$commandsCount`,
      d.client.cmd.default.size
    ),
  };
};
