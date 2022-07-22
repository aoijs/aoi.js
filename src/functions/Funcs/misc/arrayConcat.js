module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [separator, ...names] = data.inside.splits;
  
  const name = names.shift();

  if (!d.data.arrays[name]) {
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "Array with name '" + name + "' does not exist.",
    );
  }

  data.result = d.arrays[name]
    .concat(...names.map((x) => d.arrays[x]))
    .join(separator);
  return {
    code: d.util.setCode(data),
  };
};
