module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  const { code } = d.command;

  const [objectName, json] = data.inside.splits;

  try {
    const object = JSON.parse(json.addBrackets());
    d.data.objects = d.data.objects || {};
    d.data.objects[objectName] = object;
    d.object = object;
  } catch (e) {
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Failed To Create Object With Reason: " + e
    );
  }

  return {
    code: d.util.setCode({ function: d.func, code: code, inside: data.inside }),
    data: { ...d.data, objects: { ...d.data.objects } },
  };
};
