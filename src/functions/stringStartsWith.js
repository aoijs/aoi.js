/**
 * @param {import("..").Data} d
 */
module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, ...checks] = data.inside.splits;
    data.result = checks.some(check => text.addBrackets().startsWith(check.addBrackets()))

    return {
      code: d.util.setCode(data)
    }
  }
