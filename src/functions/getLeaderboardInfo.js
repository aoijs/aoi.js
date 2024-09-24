/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [variable, id, type = "guild", format, table = d.client.db.tables[0]] = data.inside.splits;

  if (!d.client.variableManager.has(variable, table)) return d.aoiError.fnError(d, "custom", {}, `Variable "${variable}" Not Found`);

  if (!type || (type.toLowerCase() !== "guild" && type.toLowerCase() !== "user" && type.toLowerCase() !== "global")) return d.aoiError.fnError(d, "custom", {}, `Invalid type, must be "guild", "user" or "global"`);

  let key;
  let user;

  if (type === "guild") {
    key = `${variable}_${id}`
    user = await d.util.getGuild(d, id);
  } else if (type === "user") {
    key = `${variable}_${id}_${d.guild?.id}`
    user = await d.util.getUser(d, id);
  } else if (type === "global") {
    key = `${variable}_${id}`
    user = await d.util.getUser(d, id);
  }

  let db = await d.client.db.findMany(table, (data) => {
    return data.key.startsWith(key.split("_")[0]) && (type === "guild" ? data.key.split("_")[2] === key.split("_")[2] : true)
  });

  switch (format) {
    case "top":
      data.result = db.sort((a, b) => b.value - a.value).findIndex((x) => x.key === key) + 1 || 0;
      break;
    case "value":
      data.result = db.find(x => x.key === key)?.value || 0;
      break;
    case "id":
      data.result = user.id || null;
      break;
    case "username":
      data.result = user?.username || null;
      break;
    case "name":
      data.result = user.name || null;
      break;
    case "tag":
      data.result = user?.tag;
      break;
    default:
      data.result = user?.username || user?.name || null;
  }

  return {
    code: d.util.setCode(data),
  };
};
