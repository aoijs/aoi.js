module.exports = async (d) => {
  const data = d.util.aoiFunc(d);

  const [objectName, newObjectName] = data.inside.splits;
  const objects = d.data.objects;

  if (!objects || !objects[objectName]) {
    return d.aoiError.fnError(d, "custom", {}, "Invalid object");
  }

  const clonedObject = JSON.parse(JSON.stringify(objects[objectName]));
  d.data.objects[newObjectName] = clonedObject;

  return {
    code: d.util.setCode(data),
    data: d.data,
  };
};
