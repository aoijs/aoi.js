module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$filterMessage").length - 1;

  const inside = code.split("$filterMessage")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let [text, letters] = inside.splits;

  text = text.split(letters).join("");

  return {
    code: code.replaceLast(`$filterMessage${inside}`, text),
  };
};
