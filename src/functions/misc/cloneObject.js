module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  const { code } = d.command;

  const [objectName, newObjectName] = data.inside.splits;
  const objects = d.data.objects;

  if (!objects || !objects[objectName]) {
    return d.aoiError.fnError(d, "custom", {}, "Object not found!");
  }

  const clonedObject = JSON.parse(JSON.stringify(objects[objectName]));
  d.data.objects[newObjectName] = clonedObject;

  return {
    code: d.util.setCode({ function: d.func, code: code, inside: data.inside }),
    data: { ...d.data, objects: { ...d.data.objects } },
  };
};
