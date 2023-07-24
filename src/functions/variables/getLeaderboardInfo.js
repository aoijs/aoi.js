module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [variable, id, type = "guild", format, table = d.client.db.tables[0]] = data.inside.splits;

  let key = null;
  let cache = null;
  let user = null;

  const all = await d.client.db.all(table, variable);

  if (type === "guild") {
    key = `${variable.addBrackets()}_${`${id}_${
      d.guild?.id === undefined ? "dm" : d.guild?.id
    }`}`;
    cache = await d.client.guilds.cache.get(id);
    user =
      typeof cache === "undefined" || Object.keys(cache).length === 0
        ? await d.client.users.fetch(id)
        : undefined;
  } else if (type === "global") {
    key = `${variable.addBrackets()}_${id}`;
    cache = await d.client.guilds.cache.get(id);
    user =
      typeof cache === "undefined" || Object.keys(cache).length === 0
        ? await d.client.users.fetch(id)
        : undefined;
  } else if (type === "message" || type === "channel") {
    key = `${variable.addBrackets()}_${id}`;
  } else {
    d.aoiError.fnError(d, "custom", { inside: data.inside }, `type`);
  }

  const foundData = all.find((x) => x.key === key);
  const foundDataMap = all
    .map((x, pos) => ({ value: x.value, key: x.key, pos: pos + 1 }))
    .sort((a, b) => a.value - b.value);
  let value = foundData?.value ?? 0;

  switch (format) {
    case "top":
      data.result = foundDataMap.find((x) => x.key === key)?.pos || null;
      break;
    case "value":
      data.result = value;
      break;
    case "tag":
      data.result = user.tag || null;
      break;
    case "username":
      data.result = user.username || null;
      break;
    default:
      data.result = null;
  }

  return {
    code: d.util.setCode(data),
  };
};
