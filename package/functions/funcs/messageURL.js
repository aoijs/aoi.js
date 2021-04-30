module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(`$messageURL`, d.message.url),
  };
};
