const checkCondition = async (d) => {
  const code = d.command.code;

  const r = code.split("$checkCondition").length - 1;

  const inside = code.split("$checkCondition")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const p = inside.splits;

  const condition = p.shift();

  const operators = () => {
    for (const op of ["<=", ">=", "==", "!=", "<", ">"]) {
      if (condition.includes(op)) return op;
    }
  };

  const op = operators();

  if (!operators)
    return d.error(`:x: No valid operator in \`$checkCondition${inside}\``);

  const fields = condition.split(op);

  let pass = true;

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
      Number(fields[1]) === NaN
    )
      pass = false;
  } else if (op === "!=") {
    if (fields[0].addBrackets() === fields[1].addBrackets()) pass = false;
  }

  return {
    code: code.replaceLast(`$checkCondition${inside}`, pass),
  };
};

module.exports = checkCondition;
