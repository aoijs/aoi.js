module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [text, ...checks] = data.inside.splits;
    const result = checks.some(check => text.addBrackets().endsWith(check.addBrackets()));
    data.result = result

    return {
      code: d.util.setCode(data)
    }
  }
