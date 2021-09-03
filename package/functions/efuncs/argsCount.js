module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(`$argsCount`, d.args.length),
  };
};
