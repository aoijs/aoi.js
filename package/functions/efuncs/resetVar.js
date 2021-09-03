module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  if (d.client.variables[inside.inside] === undefined)
    return d.error(
      `:x: Invalid variable '${inside.inside}' in \`$resetVar${inside}\``
    );

  await d.client.db.delete("main", inside.inside);

  return {
    code: code.replaceLast(`$resetVar${inside}`, ""),
  };
};
