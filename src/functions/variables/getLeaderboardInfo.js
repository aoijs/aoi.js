module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [variable, id, type, table = d.client.db.tables[0]] =
    data.inside.splits;

  const all = await d.client.db.all(table, variable);

  const key = `${variable.addBrackets()}_${`${id}_${
    d.guild?.id === undefined ? "dm" : d.guild?.id
  }`}`;

  const foundData = all.find((x) => x.key === key);
  const foundDataMap = all
    .map((x, pos) => ({ value: x.value, key: x.key, pos: pos + 1 }))
    .sort((a, b) => a.value - b.value);
  let value = foundData?.value ?? 0;

  const cache = await d.client.guilds.cache.get(id);
  const user =
    typeof cache === "undefined" || Object.keys(cache).length === 0
      ? await d.client.users.fetch(id)
      : undefined;

  switch (type) {
    case "top":
      data.result = foundDataMap.find((x) => x.key === key).pos;
      break;
    case "value":
      data.result = value;
      break;
    case "tag":
      data.result = user.tag;
      break;
    case "username":
      data.result = user.username;
      break;
    default:
      data.result = null;
  }

  return {
    code: d.util.setCode(data),
  };
};
