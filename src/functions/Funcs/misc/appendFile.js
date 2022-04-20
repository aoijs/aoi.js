const fs = require("fs/promises");

module.exports = (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  const [file, text, encode = "utf8"] = data.inside.splits;

  await fs
    .appendFile(file, data, {
      encoding: encode,
    })
    .catch((e) => {
      d.aoiError.fnError(
        d,
        "custom",
        {},
        "Failed To Append File With Reason: " + e,
      );
    });

  return {
    code: d.util.setCode(data),
  };
};
