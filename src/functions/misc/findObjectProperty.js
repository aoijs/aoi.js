module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    if (!d.object) return d.aoiError.fnError(d, "custom", {}, "No Object Present");
  
    const [property, format = false] = data.inside.splits;
    let object = d.object;
  
    const properties = {};
    for (const prop in object) {
      if (prop === property) {
        properties[prop] = object[prop];
      }
    }
  
    data.result = JSON.stringify(properties, null, format === "true" ? 2 : 0);
    return {
      code: d.util.setCode(data),
    };
  };
  