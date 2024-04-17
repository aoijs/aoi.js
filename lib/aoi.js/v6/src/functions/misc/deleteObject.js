module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  const { code } = d.command;

  if (!d.data.objects) return d.aoiError.fnError(d, "custom", {}, "object");

  const objects = data.inside.splits;
  try {
    for (const objectName of objects) {
      if (d.data.objects && objects in d.data.objects) {
        delete d.data.objects[objectName];
      }
    }
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
