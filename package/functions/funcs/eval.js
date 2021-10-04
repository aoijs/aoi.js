const interpreter = require("../../interpreter.js");
const insensitiveInterpreter = require("../../insensitiveInterpreter");
module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$eval").length - 1;

  const inside = code.split("$eval")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [CODE, returnCode = "no", int = "new"] = inside.splits;

  const c =
    int === "insensitive"
      ? await insensitiveInterpreter(
          d.client,
          d.message,
          d.args,
          {
            name: "eval",
            code: CODE.addBrackets(),
            error: d.command.error,
          },
          {},
          returnCode === "yes"
        )
      : await interpreter(
          d.client,
          d.message,
          d.args,
          {
            name: "eval",
            code: CODE.addBrackets(),
            error: d.command.error,
          },
          {},
          returnCode === "yes"
        );

  return {
    code: code.replaceLast(`$eval${inside}`, c ? c : ""),
  };
};
