const addReactions = async (d) => {
  const code = d.command.code;

  if (code.split("$addReactions").length >= 3)
    return d.message.channel.send(`❌ Can't use more than one $addReactions `);

  const inside = code.split(`$addReactions`)[1].after();

  return {
    code: code.replaceLast(`$addReactions${inside.total}`, ""),
    reactions: inside.splits.map((r) => r.addBrackets()),
  };
};

module.exports = addReactions;
