module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$variablesCount`,
      Object.keys(d.client.variables).length),
  };
};
