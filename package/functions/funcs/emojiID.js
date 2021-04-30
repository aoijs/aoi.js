module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$emojiID`,
      d.message.reaction ? d.message.reaction.emoji.id || "" : ""
    ),
  };
};
