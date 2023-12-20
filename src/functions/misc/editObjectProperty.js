module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const { code } = d.command;
  
    const [objectName, property, propertyValue] = data.inside.splits;
    const properties = property.split('.');
  
    if (!d.data.objects) return d.aoiError.fnError(d, "custom", {}, "Object");
  
    let object = d.data.objects[objectName] || {};
  
    let Object = object;
    for (let i = 0; i < properties.length - 1; i++) {
      const propertyName = properties[i];
      Object[propertyName] = Object[propertyName] || {};
      Object = Object[propertyName];
    }
  
    try {
      Object[properties[properties.length - 1]] = JSON.parse(propertyValue);
    } catch (e){ 
      Object[properties[properties.length - 1]] = propertyValue;
    }
  
    d.data.objects[objectName] = object;
    d.object = object;
  
    return {
      code: d.util.setCode({ function: d.func, code: code, inside: data.inside }),
      data: { ...d.data, objects: { ...d.data.objects } },
    };
  };
  