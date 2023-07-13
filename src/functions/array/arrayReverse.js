module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [name] = data.inside.splits;

  if (!d.data.arrays[name]) {
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "Array With Name '" + name + "' Does Not Exist.",
    );
  }

  d.arrays[name] = d.arrays[name].reverse();
  d.data.arrays = d.arrays;
  return {
    code: d.util.setCode(data),
    arrays: d.arrays,
    data: d.data,
  };
};
