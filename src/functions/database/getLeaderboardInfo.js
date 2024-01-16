module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
  
    const [variable, id, type = "guild", format, table = d.client.db.tables[0]] =
      data.inside.splits;
  
    if (!d.client.variableManager.has(variable, table)) return d.aoiError.fnError(d, "custom", {}, `Variable "${variable}" Not Found`);
  
    let key = null;
    let cache = null;
    let user = null;
      if (type === "guild") {
          key = `${variable.addBrackets()}_${`${id}_${
              d.guild?.id === "undefined" ? "dm" : d.guild?.id
          }`}`;
          cache = await d.util.getGuild(d, id);
          user =
              typeof cache === "undefined" || Object.keys(cache).length === 0
                  ? await d.util.getUser(d, id)
                  : undefined;
      } else if (type === "global") {
          key = `${variable.addBrackets()}_${id}`;
          cache = await d.util.getGuild(d, id);
          user =
              typeof cache === "undefined" || Object.keys(cache).length === 0
                  ? await d.util.getUser(d, id)
                  : undefined;
      } else if (type === "message" || type === "channel") {
          key = `${variable.addBrackets()}_${id}`;
      } else {
          d.aoiError.fnError(d, "custom", { inside: data.inside }, `type`);
      }
    const all = await d.client.db.all(table, (data) =>
      data.key.startsWith(variable.deleteBrackets()) && 
      data.key.split("_").length === key.split("_").length && (
        type === "guild" ? data.key.split("_")[2] === key.split("_")[2] : true
      )
    );
  
    switch (format) {
      case "top":
        data.result = all.sort((a, b) => b.value - a.value).findIndex((x) => x.key === key) + 1 || 0;
        break;
      case "value":
        data.result = all.find(x => x.key === key).value || 0;
        break;
      case "id":
        data.result = user.id || null;
        break;
      case "username":
        data.result = user.username || null;
        break;
      case "tag":
        data.result = user.tag || '0000';
        break;
      default:
        data.result = null;
    }
  
    return {
      code: d.util.setCode(data),
    };
  };