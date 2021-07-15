const ms = require("parse-ms");
const moment = require("moment");

module.exports = async (d) => {
  let code = d.command.code;

  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let [id=d?.command?.id,option] = inside.splits;



  return {
    code: code.replaceLast(`$channel${inside}`, option),
  };
};
