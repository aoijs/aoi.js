module.exports = (d) => {
  return {
    code: d.command.code.replaceLast(`$commandCode`, d.command.code),
  };
};
