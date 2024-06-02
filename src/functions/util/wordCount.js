
module.exports = async d => {
  const data = d.util.aoiFunc(d);
  const [text, find] = data.inside.splits;

  data.result = find
    ? (text.split(find).length - 1) * find.split(/\s+/).length
    : text.split(/\s+/).length;

  return {
    code: d.util.setCode(data)
  };
};
