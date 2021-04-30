module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(`$channelUsed`, d.channelUsed || ""),
  };
};
