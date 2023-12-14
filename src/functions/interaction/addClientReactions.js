module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  let [...reactions] = data.inside.splits;

  reactions = reactions.map((x) => {
    try {
      let emoji = d.util.getEmoji(d, x.addBrackets());
      x = emoji.id ? `:${emoji.name}:${emoji.id}` : emoji.name;
    } catch {
      x = x?.addBrackets() ?? undefined;
    } finally {
      if (x === undefined) return d.util.aoiError.fnError(d, "custom", { inside: data.inside }, "Emoji");
    }
    return x;
  });

  data.result = "";

  return {
    code: d.util.setCode(data),
    reactions,
  };
};
