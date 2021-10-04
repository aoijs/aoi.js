const setVar = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [variable, value] = inside.splits;

  if (d.client.variables[variable] === undefined)
    return d.error(`:x: Variable '${variable}' not found`);

  await d.client.db.set("main", variable, value);

  return {
    code: code.replaceLast(`$setVar${inside}`, ""),
  };
};

module.exports = setVar;
