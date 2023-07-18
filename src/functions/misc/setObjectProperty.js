module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  const { code } = d.command;

  const [objectName, propertyName, propertyValue] = data.inside.splits;

  if (!d.data.objects) return d.aoiError.fnError(d, "custom", {}, "Object");

  const object = d.data.objects[objectName] || {};

  try {
    object[propertyName] = JSON.parse(propertyValue);
  } catch (e) {
    object[propertyName] = propertyValue;
  }

  d.data.objects[objectName] = object;
  d.object = object;

  return {
    code: d.util.setCode({ function: d.func, code: code, inside: data.inside }),
    data: { ...d.data, objects: { ...d.data.objects } },
  };
};
