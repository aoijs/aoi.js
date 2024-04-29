module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (!d.data.objects) return d.aoiError.fnError(d, "custom", {}, "object");

  const [objectName, property, format = false] = data.inside.splits;
  let object = d.data.objects?.[objectName];

  if (!object) {
    return d.aoiError.fnError(d, "custom", {}, "Object not found!");
  }

  const properties = {};
  for (const prop in object) {
    if (prop === property) {
      properties[prop] = object[prop];
    }
  }

  data.result = JSON.stringify(properties, null, format === "true" ? 2 : 0);

  return {
    code: d.util.setCode(data),
  };
};
