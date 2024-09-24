const Interpreter = require("../core/interpreter.js");

/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [awaitfunc] = data.inside.splits;

  const cmd = d.client.cmd.awaited.find(
    (x) => x.name.toLowerCase() === awaitfunc.addBrackets().toLowerCase()
  );

  if (!cmd)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      `Invalid Awaited Command: '${awaitfunc.addBrackets()}' Provided`
    );

  await Interpreter(
    d.client,
    d.message,
    d.args,
    cmd,
    d.client.db,
    false,
    undefined,
    d.data
  );

  data.result = null;

  return {
    code: d.util.setCode(data),
  };
};
