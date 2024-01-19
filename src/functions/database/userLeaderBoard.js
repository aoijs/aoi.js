module.exports = async d => {
  const data = d.util.aoiFunc(d);
  if (data.err) return d.error(data.err);

  const [
    guildID = d.guild?.id,
    variable,
    order = 'asc',
    custom = `{top}. {username}: {value:,}`,
    list = 10,
    page = 1,
    table = d.client.db.tables[0],
    hideNegativeValue = false,
    hideZeroValue = false
  ] = data.inside.splits;

  const guild = await d.util.getGuild(d, guildID);
  if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

  if (!d.client.variableManager.has(variable, table)) return d.aoiError.fnError(d, 'custom', {}, `Variable "${variable}" Not Found`);

  if (!order || (order.toLowerCase() !== "asc" && order.toLowerCase() !== "desc")) return d.aoiError.fnError(d, 'custom', {}, `order must be "desc" or "asc"`)

  let db = await d.client.db.all(table, (data) => data.key.startsWith(variable.deleteBrackets()) && (data.key.split("_").length === 3) && (data.key.split("_")[2] == guildID));

  db.sort((a, b) => Number(a.value) - Number(b.value));
  if (order === "desc") db = db.reverse();

  if (hideNegativeValue === "true") db = db.filter(x => x.value >= 0);
  if (hideZeroValue === "true") db = db.filter(x => x.value != 0);

  let y = 0;
  let value; 
  let content = [];

  for (const Data of db) {
    let user;
    if (d.client.db.type === "aoi.db") value = Number(Data.value);
    else value = Number(Data.data.value);
    user = await d.util.getMember(guild, Data.key.split('_')[1]);

    if (user) {
      nick = user.nickname
      user = user.user;
      y++;
      let text = custom
        .replaceAll(`{top}`, y)
        .replaceAll("{id}", user.id)
        .replaceAll("{tag}", user.tag)
        .replaceAll(`{username}`, user.username.removeBrackets())
        .replaceAll(`{value}`, value)
        .replaceAll(`{nick}`, nick || user.username);

      if (text.includes("{value:")) {
        let sep = text.split("{value:")[1].split("}")[0];
        text = text.replaceAll(`{value:${sep}}`, value.toLocaleString().replaceAll(",", sep));
      }
      if (text.includes("{execute:")) {
        let ins = text.split("{execute:")[1].split("}")[0];

        const awaited = d.client.cmd.awaited.find(c => c.name === ins);

        if (!awaited) return d.aoiError.fnError(d, 'custom', { inside: data.inside }, ` Invalid awaited command '${ins}' in`);

        const code = await d.interpreter(d.client, {
          guild: guild,
          channel: d.message.channel,
          author: user
        }, d.args, awaited, undefined, true);

        text = text.replace(`{execute:${ins}}`, code);
      }

      content.push(text);
    }
  }

  data.result = content.slice(page * list - list, page * list).join("\n");

  return {
    code: d.util.setCode(data)
  };
};
