module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(`$cpu`, d.client.cpu.toFixed(2)),
  };
};
