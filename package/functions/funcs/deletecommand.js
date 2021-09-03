module.exports = async (d) => {
  d.message.delete().catch((err) => {});

  return {
    code: d.command.code.replaceLast(`$deletecommand`, ""),
  };
};
