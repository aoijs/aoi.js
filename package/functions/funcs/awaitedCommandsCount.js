const awaitedCount = (d) => {
  return {
    code: d.command.code.replaceLast("$awaitedCommandsCount", d.client_awaited_commands.size)
  };
module.exports = awaitedCount;
