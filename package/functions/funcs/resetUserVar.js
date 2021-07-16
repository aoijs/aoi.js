module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [
    variable,
    guildID = d.message.guild ? d.message.guild.id : "",
  ] = inside.splits;

  if (d.client.variables[inside.inside] === undefined)
    return d.error(
      `\`${d.func}: Invalid variable '${variable}' in ${inside}\``);

  if (!guildID)
    return d.error(`\`${d.func}: No guild ID provided in ${inside}\``);

  const all = await d.client.db.all("main", {
    filter: (x) => x.key.startsWith(`${variable}_${guildID}_`),
  });

  await Promise.all(all.map((x) => d.client.db.delete("main", x.key)));

  return {
    code: code.replaceLast(`$resetUserVar${inside}`, ""),
  };
};
