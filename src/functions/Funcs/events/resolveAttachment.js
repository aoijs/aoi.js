module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const id = data.inside.inside;

  data.result = d.data.interaction.resolved.attachments.get(id);

  return {
    code: d.util.setCode(data),
  };
};
