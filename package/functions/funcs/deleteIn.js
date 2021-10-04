const ms = require("ms");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = code.split("$deleteIn")[1].after();

  const time = ms(inside.inside);

  if (!time) return d.error(`:x: Invalid time in \`$deleteIn${inside}\``);

  return {
    deleteIn: time, //ez w
    //now we go to interpreter
    code: code.replaceLast(`$deleteIn${inside}`, ""),
  };
};
