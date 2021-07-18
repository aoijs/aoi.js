const ms = require("ms");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = code.split("$deleteIn")[1].after();

  const time = ms(inside.inside);

  if (!time) return d.error(`\`${d.func}: Invalid time in ${inside}\``);

  return {
    deleteIn: time,
    code: code.replaceLast(`$deleteIn${inside}`, ""),
  };
};
