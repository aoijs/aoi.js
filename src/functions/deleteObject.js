/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);

  if (!d.data.objects) return d.aoiError.fnError(d, "custom", {}, "Invalid object");

  const objects = data.inside.splits;
  try {
    for (const objectName of objects) {
      if (d.data.objects && objects in d.data.objects) {
        delete d.data.objects[objectName];
      }
    }
  } catch (e) {
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Failed To Create Object With Reason: " + e
    );
  }

  return {
    code: d.util.setCode(data),
    data: d.data,
  };
};
