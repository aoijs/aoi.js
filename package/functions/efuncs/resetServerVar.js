module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  if (d.client.variables[inside.inside] === undefined)
    return d.error(
      `:x: Invalid variable '${inside.inside}' in \`$resetServerVar${inside}\``
    );

  const all = await d.client.db.all("main", {
    filter: (x) =>
      x.key.startsWith(`${inside.inside}_`) &&
      x.key.split("_").length < 3 &&
      d.client.guilds.cache.has(x.key.split("_")[1]),
  });

  await Promise.all(all.map((x) => d.client.db.delete("main", x.key)));

  return {
    code: code.replaceLast(`$resetServerVar${inside}`, ""),
  };
};
