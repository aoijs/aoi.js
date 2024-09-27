/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [objectName, sep = ", "] = data.inside.splits;
  if (!d.data.objects) return d.aoiError.fnError(d, "custom", {}, "object");

  const object = d.data.objects?.[objectName];

  if (!object) return d.aoiError.fnError(d, "custom", {}, "Object not found!");

  const keys = [];

  const stack = Array.isArray(object) ? [...object] : [object];

  while (stack.length > 0) {
    const current = stack.pop();
    for (const key in current) {
      keys.push(key);
      if (typeof current[key] === "object") {
        stack.push(current[key]);
      }
    }
  }

  data.result = keys.join(sep);

  return {
    code: d.util.setCode(data),
  };
};
