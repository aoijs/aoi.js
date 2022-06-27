module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [separator, ...name] = data.inside.splits;

  if (!d.data.arrays[name]) {
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "Array with name '" + name + "' does not exist.",
    );
  }

  data.result = d.arrays[name]
    .concat(...name.map((x) => d.arrays[x]))
    .join(separator);
  return {
    code: d.util.setCode(data),
  };
};
