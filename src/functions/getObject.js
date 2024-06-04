module.exports = (d) => {
  const data = d.util.aoiFunc(d);
  
  const [objectName, format] = data.inside.splits;
  if (!d.data.objects) return d.aoiError.fnError(d, "custom", {}, "object");

  const object = d.data.objects?.[objectName];

  if (!object) {
    return d.aoiError.fnError(d, "custom", {}, "Object not found!");
  }

  data.result = JSON.stringify(object, null, format === "true" ? 2 : 0);

  return {
    code: d.util.setCode(data),
  };
};
