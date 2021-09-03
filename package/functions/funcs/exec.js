const cld = require("child_process");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$exec").length - 1;

  const inside = code.split("$exec")[r].after();
  try {
    var data = await cld.execSync(inside.addBrackets()).toString();
  } catch (e) {
    data = e.message;
  }

  return {
    code: code.replaceLast(`$exec${inside}`, (data || "").deleteBrackets()),
  };
};
