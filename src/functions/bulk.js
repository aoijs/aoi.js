const { BulkData } = require("../utils/EventUtil.js");

/**
 * @param {import("..").Data} d
 */
module.exports = (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [option, sep = " , "] = data.inside.splits;

  data.result = BulkData(d, sep, option).deleteBrackets();

  return {
    code: d.util.setCode(data),
  };
};
