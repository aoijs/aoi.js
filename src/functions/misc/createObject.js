/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  const [objectName, json] = data.inside.splits;

  try {
    const object = JSON.parse(json.addBrackets());
    d.data.objects = d.data.objects || {};
    d.data.objects[objectName] = object;
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
