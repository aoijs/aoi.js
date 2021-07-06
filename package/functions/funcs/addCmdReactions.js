const addCmdReactions = async (d) => {
  const code = d.command.code;

  if (code.split("$addCmdReactions").length >= 3)
    return d.message.channel.send(
      `\`${d.func}: Can't use more than one\` `
    );

  const inside = code.split("$addCmdReactions")[1].after();

  for (const reaction of inside.splits) {
    const react = await d.message
      .react(reaction.addBrackets())
      .catch((err) => {});

    if (!react) return d.error(`\`ReactionError: Failed to add '${reaction}' reaction \``);
  }

  return {
    code: code.replaceLast(`$addCmdReactions${inside.total}`, ""),
  };
};

module.exports = addCmdReactions;
