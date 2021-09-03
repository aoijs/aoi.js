module.exports = async (d) => {
  return {
    code: d.command.code.replaceLast(
      `$emojiName`,
      d.message.reaction ? d.message.reaction.emoji.name || "" : ""
    ),
  };
};
