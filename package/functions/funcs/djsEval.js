module.exports = async (d) => {
  const {
    channel,
    message,
    data,
    error,
    command,
    embed,
    array,
    randoms,
    client,
  } = d;

  const code = d.command.code;

  const r = code.split(`$djsEval`).length - 1;

  const inside = code.split("$djsEval")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  let OUTPUT = false;

  if (["yes", "no"].includes(fields[fields.length - 1])) {
    OUTPUT = fields[fields.length - 1];
    fields.pop();
  }

  let CODE = fields.join(";");
  try {
    var evaled = await eval(CODE.addBrackets());
  } catch (error) {
    d.error(error.message + ` in \`$djsEval${inside}\``);
  }

  return {
    code: d.command.code.replaceLast(
      `$djsEval${inside}`,
      OUTPUT === "yes"
        ? typeof evaled === "object"
          ? require("util").inspect(evaled, { depth: 0 }).deleteBrackets()
          : typeof evaled === "string"
          ? evaled.deleteBrackets()
          : evaled
        : ""
    ),
  };
};
