const axios = require("axios").default;

module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  let response = false;

  try {
    response = await axios
      .get(inside.inside)
      .then((res) => res.headers["content-type"].startsWith("image"));
  } catch {
    response = false;
  }

  return {
    code: code.replaceLast(`$isValidImageLink${inside}`, response),
  };
};
