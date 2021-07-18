const errorHandler = require("../../handlers/errors.js");
const onlyIf = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const p = inside.splits;

  const condition = p.shift();

  const errorMessage = p.join(";");

  let pass = true;
  const operators = (Condition) => {
    for (const op of ["<=", ">=", "==", "!=", "<", ">"]) {
      if (Condition.includes(op)) return op;
    }
  };

  const op = operators(condition);

  if (!op)
    return d.error(`\`${d.func}: No valid operator in ${inside}\``);

  const fields = condition.split(op);

  if (op === "<=") {
    if (
      Number(fields[0]) > Number(fields[1]) ||
      !fields[0] ||
      !fields[1] ||
      Number(fields[0]) === NaN ||
      Number(fields[1]) === NaN
    )
      pass = false;
  } else if (op === ">=") {
    if (
      Number(fields[0]) < Number(fields[1]) ||
      !fields[0] ||
      !fields[1] ||
      Number(fields[0]) === NaN ||
      Number(fields[1]) === NaN
    )
      pass = false;
  } else if (op === "==") {
    if (fields[0].addBrackets() !== fields[1].addBrackets()) pass = false;
  } else if (op === "<") {
    if (
      Number(fields[0]) >= Number(fields[1]) ||
      !fields[0] ||
      !fields[1] ||
      Number(fields[0]) === NaN ||
      Number(fields[1]) === NaN
    )
      pass = false;
  } else if (op === ">") {
    if (
      Number(fields[0]) <= Number(fields[1]) ||
      !fields[0] ||
      !fields[1] ||
      Number(fields[0]) === NaN ||
      !Number(fields[1]) === NaN
    )
      pass = false;
  } else if (op === "!=") {
    if (fields[0].addBrackets() === fields[1].addBrackets()) pass = false;
  }

  if (!pass) return errorHandler(d, errorMessage);

  return {
    code: code.replaceLast(`$onlyIf${inside}`, ""),
  };
};

module.exports = onlyIf;
