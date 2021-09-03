const addReactions = async (d) => {
  const code = d.command.code;
  if (code.split("$addReactions").length >= 3)
    return d.error(`$addReactions: Can't Use More Than One.`);
  const inside = d.unpack();
  return {
    code: code.replaceLast(`$addReactions${inside.total}`, ""),
    reactions: inside.splits.map((r) => r.addBrackets())
  }
};
module.exports = addReactions;