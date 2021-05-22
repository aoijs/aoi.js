module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      "$lastPinTimestamp",
      d.message.channel.lastPinTimestamp
    ),
  };
};
