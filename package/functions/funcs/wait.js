const ms = require("ms");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  await new Promise((e) => setTimeout(e, ms(inside.inside)));

  return {
    code: code.replaceLast(`$wait${inside}`, ""),
  };
};
