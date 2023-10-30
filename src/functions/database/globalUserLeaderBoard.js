module.exports = async (d) => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [
    variable,
    type = "asc",
    custom = `{top}. {username}: {value:,}`,
    list = 10,
    page = 1,
    table = d.client.db.tables[0],
  ] = data.inside.splits;

  if (!d.client.variableManager.has(variable, table)) return d.aoiError.fnError(d, 'custom', {}, `Variable "${variable}" Not Found`);
  
  let db = await d.client.db.all(table, variable.addBrackets(), 1);
  db.sort((a, b) => a.value - b.value);

  if (type === "desc") db = db.reverse();

  let y = 0;
  let value;
  let content = [];
  db = db.slice(page * list - list, page * list);

  for (const Data of db) {
    let user;
    value = Number(Data.value);
    user = await d.util.getUser(d, Data.key.split("_")[1]);

    if (user) {
      y++;
      let text = custom
        .replaceAll(`{top}`, y)
        .replaceAll("{id}", user.id)
        .replaceAll("{tag}", user.tag)
        .replaceAll(`{username}`, user.username.removeBrackets())
        .replaceAll(`{value}`, value);

      if (text.includes("{value:")) {
        let sep = text.split("{value:")[1].split("}")[0];
        text = text.replaceAll(`{value:${sep}}`, value.toLocaleString().replaceAll(",", sep));
      }

      if (text.includes("{execute:")) {
        let ins = text.split("{execute:")[1].split("}")[0];
        const awaited = d.client.cmd.awaited.find((c) => c.name === ins);

        if (!awaited)
          return d.aoiError.fnError(
            d,
            "custom",
            { inside: data.inside },
            ` Invalid awaited command '${ins}' in`,
          );

        const CODE = await d.interpreter(
          d.client,
          {
            guild: d.message.guild,
            channel: d.message.channel,
            author: user,
          },
          d.args,
          awaited,
          undefined,
          true,
        );
        text = text.replaceAll(`{execute:${ins}}`, CODE);
      }
      content.push(text);
    }
  }

  data.result = content.join("\n");

  return {
    code: d.util.setCode(data),
  };
};