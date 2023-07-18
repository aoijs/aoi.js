module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const inside = d.unpack();
    const err = d.inside(inside);
    if (err) return d.error(err);
    if (!d.object) return d.aoiError.fnError(d, "custom", {}, "No Object Present")
    
    const properties = data.inside.splits; 
    let object = d.object;
  
    properties.forEach((property) => {
      delete object[property];
    });
  
    d.object = object;
  
    return {
      code: d.util.setCode(data),
      data: { ...d.data, object: d.object },
    };
  };
  