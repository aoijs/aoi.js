const Discord = require("discord.js");

module.exports = async (d) => {
  let code = d.command.code;
  let vars = d.vars;

  let r = code.split("$get").length - 1;

  let inside = code.split("$get")[r].after();

  let value = vars[inside.inside];

  code = code.replaceLast(`$get${inside.total}`, value || "");

  return {
    code: code,
  };
};
