module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);
  let template;

  const [templateCode, property] = data.inside.splits;

  try {
    template = await d.client.fetchGuildTemplate(`https://discord.new/${templateCode}`);
  } catch (err) {
    return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Template ID");
  }

  data.result = property.split(".").reduce((obj, prop) => obj && obj[prop], template);

  return {
    code: d.util.setCode(data),
  };
};
