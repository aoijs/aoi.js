module.exports = (d) => {
  const botPing = Date.now() - d.message.createdTimestamp
  return {
    code: d.command.code.replaceLast(
      "$botPing",
      `${botPing}`
    ),
  };
};
