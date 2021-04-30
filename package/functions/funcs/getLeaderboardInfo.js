module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$getLeaderboardInfo").length - 1;

  const inside = code.split("$getLeaderboardInfo")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [variable, id, type = "user", option = "top"] = inside.splits;

  const res =
    type === "user"
      ? `${d.message.guild.id}_`
      : type === "globaluser"
      ? ""
      : id;

  const docs = (
    await d.client.db.all("main", {
      filter: (x) => x.key.startsWith(variable),
    })
  )
    .filter((e) => e.key.startsWith(`${variable}_${res}`))
    .sort((x, y) => Number(y.data.value) - Number(x.data.value));

  const ID = `${variable}_` + (res.includes("_") ? res + id : id);

  const data =
    type === "server"
      ? d.client.guilds.cache.get(id) || {}
      : await d.client.users.fetch(id);

  //console.log(docs, res)

  const options = {
    top: docs.findIndex((e) => e.key === ID) + 1,
    name: type === "server" ? data.name : data.tag,
    value: docs.find((e) => e.key === ID)
      ? docs.find((e) => e.key === ID).data.value
      : 0,
  }[option];

  return {
    code: code.replaceLast(`$getLeaderboardInfo${inside}`, options),
  };
};
