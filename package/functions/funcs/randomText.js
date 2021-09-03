module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  let output = inside.splits[Math.floor(Math.random() * inside.splits.length)];

  if (d.randoms[inside.inside] === undefined) d.randoms[inside.inside] = output;
  else output = d.randoms[inside.inside];

  return {
    randoms: d.randoms,
    code: code.replaceLast(`$randomText${inside}`, output),
  };
};
