const { CheckCondition } = require("../../utils/helpers/checkCondition")
const { mustEscape } = require("../../utils/helpers/mustEscape")

module.exports = (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [...conditions] = data.inside.splits;

  const arr = [];

  conditions.forEach((condition) => {
	arr.push(CheckCondition.solve(mustEscape(condition)))
  });

  data.result = arr.includes("true") ? true : false;

  return {
    code: d.util.setCode(data),
  };
};
