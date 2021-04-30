module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$botLastMessageChannelID`,
      d.client.user.lastMessageChannelID || ""
    ),
  };
};
