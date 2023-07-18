module.exports = async (d) => {
  const data = d.util.aoiFunc(d);

  const [objectName, sep = " , "] = data.inside.splits;
  if (!d.data.objects) return d.aoiError.fnError(d, "custom", {}, "object");

  const object = d.data.objects?.[objectName];

  if (!object) {
    return d.aoiError.fnError(d, "custom", {}, "Object");
  }

  let values = [];

  const stack = [object];

  while (stack.length > 0) {
    const current = stack.pop();
    for (const key in current) {
      const value = current[key];
      if (typeof value === "object") {
        stack.push(value);
      } else {
        values.push(value);
      }
    }
  }

  data.result = values.join(sep);

  return {
    code: d.util.setCode(data),
  };
};
