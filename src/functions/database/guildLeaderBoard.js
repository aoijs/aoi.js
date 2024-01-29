module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);
  const [variable, type = "asc", custom = `{top}. {name}: {value}`, list = 10, page = 1, table = d.client.db.tables[0], hideNegativeValue = false, hideZeroValue = false ] = data.inside.splits;

  if (!d.client.variableManager.has(variable, table)) return d.aoiError.fnError(d, 'custom', {}, `Variable "${variable}" Not Found`);

  if (!type || (type.toLowerCase() !== "asc" && type.toLowerCase() !== "desc")) return d.aoiError.fnError(d, 'custom', {}, `type must be "desc" or "asc"`)

  const result = [];

  let db = await d.client.db.all(table, (data) => { return data.key.startsWith(variable.addBrackets()) && data.key.split("_").length === 2 }, list * page, type);

  let i = 0;
  for (const lbdata of db) {
      const key = lbdata.key.split("_")[1]
      const guild = await d.util.getUser(d, key);

      if (!guild) return d.aoiError.fnError(d, "custom", {}, `guild: ${key}`);

      if (hideNegativeValue === true && lbdata.value < 0) continue;
      if (hideZeroValue === true && lbdata.value === 0) continue;

      const replacer = {
          "{value}": lbdata.value,
          "{top}": i + 1,
          "{name}": guild.username,
          "{id}": guild.id,
      }

      let text = custom;
      if (text.includes("{value:")) {
        let sep = text.split("{value:")[1].split("}")[0];
        text = text.replaceAll(`{value:${sep}}`, lbdata.value.toLocaleString().replaceAll(",", sep));
      }

      for (const replace in replacer) {
          text = text.replace(new RegExp(replace, "g"), replacer[replace]);
      }

      result.push(text);
      i++
  }
  
  data.result = result.slice(page * list - list, page * list).join("\n");

  return {
      code: d.util.setCode(data),
  };
};
