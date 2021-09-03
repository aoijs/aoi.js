module.exports = (d) => {
  return {
    code: d.command.code.replaceLast(`$commandName`, d.command.name),
  };
};
