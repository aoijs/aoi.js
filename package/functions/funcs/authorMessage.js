module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$authorMessage`,
      d.message.authorMessage ? d.message.authorMessage : ""
    ),
  };
};
