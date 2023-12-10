module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  let [...reactions] = data.inside.splits;
  reactions = reactions.reverse();

  for (let i = reactions.length - 1; i >= 0; i--) {
    let reaction;
    try {
        reaction = d.util.getEmoji(d, reactions[i].addBrackets()).id;
    } catch {
        reaction = reactions[i]?.addBrackets() ?? undefined;
    } finally {
        if (reaction === undefined) return d.util.aoiError.fnError(d, "custom", { inside: data.inside}, "Emoji");
    }
    await d.message.react(reaction).catch((err) => d.aoiError.fnError(d, "custom", {}, err.message));
  }

  data.result = "";

  return {
    code: d.util.setCode(data),
  };
};
