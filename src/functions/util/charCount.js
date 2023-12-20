module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  const [text, find] = data.inside.splits;

  data.result = find
    ? (text.split(find).length - 1) * find.length
    : text.length;

  return {
    code: d.util.setCode(data),
  };
};
