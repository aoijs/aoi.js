module.exports = async d => {
    const data = d.util.aoiFunc(d);
                  if(data.err) return d.error(data.err);
                  let [name, ...elements] = data.inside.splits;    

    if (elements[0]?.startsWith("[") && elements[0]?.endsWith("]")) {
        const element = elements[0];
        try {
            elements = JSON.parse(element);
        } catch (err) {
            d.aoiError.fnError(d, "custom", {}, `${err}`); 
        };
    };

                  d.arrays[name] = elements;
                  d.data.arrays = d.arrays;

                  return {
                            code: d.util.setCode(data),
                            arrays: d.arrays,
                            data: d.data,
                  }
}