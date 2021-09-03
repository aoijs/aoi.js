module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$findCollectionKey").length - 1;

  const inside = code.split("$findCollectionKey")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [cname, value, accurate = "yes"] = inside.splits;

  const collection = d.client.collections[cname.addBrackets()];

  if (!collection)
    return d.error(
      `❌ Invalid collection name in \`$findCollectionKey${inside}\``
    );

  const key = collection.findKey((val) => {
    let fn;

    if (accurate === "yes") {
      fn = () => value.addBrackets() === val.addBrackets();
    } else {
      val = val.toLowerCase().addBrackets();
      const v = value.addBrackets();
      fn = () => v === val || val.includes(v) || val.startsWith(v);
    }

    return fn();
  });

  return {
    code: code.replaceLast(
      `$findCollectionKey${inside}`,
      key ? key.deleteBrackets() : ""
    ),
  };
};
