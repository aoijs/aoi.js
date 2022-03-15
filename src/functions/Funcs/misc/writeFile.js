const fs = require("fs");

module.exports = (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  const [file, text, encode = "utf8"] = data.inside.splits;

  try {
    if (fs.existsSync(file)) {
      const og = fs.readFileSync(process.cwd() + "/" + file);
      const write = fs.writeFileSync(file, og + "\n" + text, {
        encoding: encode,
      });
    } else {
      const write = fs.writeFileSync(file.addBrackets(), text.addBrackets(), {
        encoding: encode,
      });
    }
  } catch (e) {
    console.error(e);
  }

  return {
    code: d.util.setCode(data),
  };
};
