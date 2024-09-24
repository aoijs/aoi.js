const { CheckCondition } = require("../core/CheckCondition")
const { mustEscape } = require("../core/mustEscape")

/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [...conditions] = data.inside.splits;

  const arr = [];

  conditions.forEach((condition) => {
	arr.push(CheckCondition.solve(mustEscape(condition)))
  });

  data.result = arr.includes("true");

  return {
    code: d.util.setCode(data),
  };
};
