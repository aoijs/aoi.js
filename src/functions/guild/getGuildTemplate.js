/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);

  const [code, property] = data.inside.splits;

  const template = await d.client.fetchGuildTemplate(code);

  data.result = property.split(".").reduce((obj, prop) => obj && obj[prop], template);

  return {
    code: d.util.setCode(data),
  };
};
