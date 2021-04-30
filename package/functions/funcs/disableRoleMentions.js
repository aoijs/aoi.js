module.exports = async (d) => {
  return {
    disabledMentions: d.disabledMentions.filter((f) => f !== "roles"),
    code: d.command.code.replaceLast(`$disableRoleMentions`, ""),
  };
};
