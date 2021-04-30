module.exports = async (d) => {
  return {
    disabledMentions: d.disabledMentions.filter((f) => f !== "everyone"),
    code: d.command.code.replaceLast("$disableEveryoneMentions", ""),
  };
};
