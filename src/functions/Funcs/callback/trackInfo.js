module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  const [func] = data.inside.splits;

  data.result = eval(`d.data.track.${func}`);

  return {
    code: d.util.setCode(data),
  };
};
