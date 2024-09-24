/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
  
    const [ code ] = data.inside.splits;

    if (!code) return d.aoiError.fnError(d, "custom", { inside: data.inside }, "code")
  
    await client.fetchGuildTemplate(code.addBrackets()).delete()
  
    return {
      code: d.util.setCode(data),
    };
  };
  