/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);

  const [objectName, newObjectName] = data.inside.splits;
  const objects = d.data.objects;

  if (!objects || !objects[objectName]) {
    return d.aoiError.fnError(d, "custom", {}, "Invalid object");
  }
  d.data.objects[newObjectName] = JSON.parse(JSON.stringify(objects[objectName]));

  return {
    code: d.util.setCode(data),
    data: d.data,
  };
};
