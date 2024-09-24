/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);

  const objectName = data.inside.splits;
  const objects = d.data.objects || {};

  data.result = objects.hasOwnProperty(objectName);

  return {
    code: d.util.setCode(data),
  };
};
