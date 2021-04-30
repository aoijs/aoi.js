const valid = {
  a: true,
  b: true,
  c: true,
  d: true,
  e: true,
  f: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
  0: true,
};

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const response = inside.inside.length
    ? inside.inside.length <= 6 &&
      !inside
        .inside
        .toLowerCase()
        .split("")
        .filter((c) => !valid[c]).length
    : false;

  return {
    code: code.replaceLast(`$isValidHex${inside}`, response),
  };
};
