const getVar = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const variable = inside.inside;

  if (d.client.variables[variable] === undefined)
    return d.error(`:x: Variable '${variable}' not found!`);

  let item = await d.client.db.get("main", variable);

  if (!item) item = { value: d.client.variables[variable] };

  item = item.value;

  return {
    code: code.replaceLast(`$getVar${inside}`, item),
  };
};

module.exports = getVar;
