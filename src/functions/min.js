/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const { code, inside, err } = d.util.aoiFunc(d);
  if (err) return d.error(err);

  const [...numbers] = inside.splits;
  if (numbers.some((x) => isNaN(x))) {
    return d.aoiError.fnError(d, 'custom', { inside: inside }, 'Invalid Number Provided In');
  }
  if (numbers.length < 2) {
    return d.aoiError.fnError(d, 'custom', { inside: inside }, `At Least 2 Numbers Are Needed. Provided ${numbers.length} Numbers In`);
  }

  const result = Math.min(...numbers);

  return {
    code: d.util.setCode({ function: d.func, inside, code, result }),
  };
};
