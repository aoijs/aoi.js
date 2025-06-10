/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [objectName, sep = " , "] = data.inside.splits;
  if (!d.data.objects) return d.aoiError.fnError(d, "custom", {}, "object");

  let object = d.data.objects?.[objectName];

  if (!object) return d.aoiError.fnError(d, "custom", {}, "Object");

  let values = [];

  const stack = Array.isArray(object) ? [...object] : [object];

  while (stack.length > 0) {
    const current = stack.pop();
    for (const key in current) {
      const value = current?.[key];
      if (Array.isArray(value)) {
        values.push(...value);
      } else if (typeof value === "object") {
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