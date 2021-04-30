module.exports = async (d) => {
  const code = d.command.code;
  const r = code.split("$emojisFromMessage").length - 1;
  const after = code.split("$emojisFromMessage")[r].after();
  if (after.inside) {
    const [text, separator = ", "] = after.splits;
    return {
      code: code.replaceLast(
        `$emojisFromMessage${after}`,
        (
          text
            .addBrackets()
            .match(/(<a?:(\w{0,32}):(\d{17,18})>|\p{Emoji_Presentation})/gu) ||
          []
        )
          .join(separator)
          .deleteBrackets()
      ),
    };
  } else {
    return {
      code: code.replaceLast(
        `$emojisFromMessage`,
        (
          d.args
            .join(" ")
            .match(/(<a?:(\w{0,32}):(\d{17,18})>|\p{Emoji_Presentation})/gu) ||
          []
        )
          .join(", ")
          .deleteBrackets()
      ),
    };
  }
};
