const axios = require("axios");

module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  const [link] = data.inside.splits;
  let response = false;

  try {
    response = await axios
      .get(data.inside.inside.addBrackets())
      .then((res) => res.headers["content-type"].startsWith("image"));
  } catch (e) {
    console.error(e);
    response = false;
  }
  data.result = response;
  return {
    code: d.util.setCode(data),
  };
};
