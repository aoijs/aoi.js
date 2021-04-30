module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$botLastMessageID`,
      d.client.user.lastMessageID || ""
    ),
  };
};
