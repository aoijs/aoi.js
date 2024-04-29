module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (!d.object) return d.aoiError.fnError(d, "custom", {}, "object");

  const [objectName, ...properties] = data.inside.splits;
  let object = d.data.objects?.[objectName];

  if (!object) {
    return d.aoiError.fnError(d, "custom", {}, "Object not found!");
  }

  properties.forEach((property) => {
    delete object[property];
  });

  return {
    code: d.util.setCode(data),
    data: { ...d.data, objects: { ...d.data.objects, [objectName]: object } },
  };
};
