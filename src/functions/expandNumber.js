const { SI_SYMBOL } = require("../utils/Constants");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const abbrNumber = data.inside.inside.toUpperCase();

  let abbrIndex;

  for (let i = SI_SYMBOL.length - 1; i >= 0; i--) {
    const sym = SI_SYMBOL[i];
    if (abbrNumber.endsWith(sym.toUpperCase())) {
      abbrIndex = i;
      break;
    }
  }
  const abbr = SI_SYMBOL[abbrIndex];
  const number = abbrIndex ? abbrNumber.slice(0, -abbr.length) : abbrNumber;
  if (isNaN(Number(number)))
    return d.aoiError.fnError(d, "custom", { inside: data.inside }, "number in");

  const num = parseFloat(number);
  const multiplier = abbrIndex ? 1e3 ** abbrIndex : 1;

  data.result = num * multiplier;

  return {
    code: d.util.setCode(data),
  };
};
