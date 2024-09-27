/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [name, type = "asc"] = data.inside.splits;

  if (!d.data.arrays?.[name]) {
    return d.aoiError.fnError( d, "custom", { inside: data.inside }, "Array with name '" + name + "' does not exist." );
  }

  d.arrays[name] = d.arrays[name].sort((a, b) =>
    String(a).localeCompare(String(b))
  );
  if (type === "dsc" || type === "desc") d.arrays[name] = d.arrays[name].reverse();

  d.data.arrays = d.arrays;
  return {
    code: d.util.setCode(data),
    arrays: d.arrays,
    data: d.data,
  };
};