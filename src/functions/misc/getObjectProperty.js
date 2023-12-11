module.exports = (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
  
    const [objectName, option] = data.inside.splits;
  
    const object = d.data.objects?.[objectName];
    if (!object) return d.aoiError.fnError("Object not found");
  
    try {
      const evaled = eval(`object?.${option}`);
      data.result = typeof evaled === "object"
        ? JSON.stringify(evaled, null, 2)
        : evaled ?? "undefined";
    } catch (e) {
      data.result = "undefined";
    }
  
    return {
      code: d.util.setCode(data),
    };
  };
  