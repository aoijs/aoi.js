module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$emojiToString`,
      d.message.reaction ? d.message.reaction.emoji.toString() : ""
    ),
  };
};
