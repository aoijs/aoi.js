module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$deleteCollectionKey").length - 1;

  const inside = code.split("$deleteCollectionKey")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [cname, key] = inside.splits;

  const c = d.client.collections[cname.addBrackets()];

  if (!c)
    return d.error(
      `❌ Invalid collection name in \`$deleteCollectionKey${inside}\``
    );

  c.delete(key.addBrackets());

  return {
    code: code.replaceLast(`$deleteCollectionKey${inside}`, ""),
  };
};
