module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  let result = inside.inside;

  if (!result || isNaN(inside.inside)) result = "undefined";
  else if (result.endsWith("11")) result = inside.inside + "th";
  else if (result.endsWith("12")) result = inside.inside + "th";
  else if (result.endsWith("13")) result = inside.inside + "th";
  else if (result.endsWith("1")) result = inside.inside + "st";
  else if (result.endsWith("2")) result = inside.inside + "nd";
  else if (result.endsWith("3")) result = inside.inside + "rd";
  else if (result === "0") result = "0";
  else result = inside.inside + "th";

  return {
    code: code.replaceLast(`$ordinal${inside}`, result),
  };
};
