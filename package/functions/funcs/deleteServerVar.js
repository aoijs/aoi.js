module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [
    variable,
    guildID = d.message.guild ? d.message.guild.id : "",
  ] = inside.splits;

  if (d.client.variables[variable] === undefined)
    return d.error(`:x: Variable '${variable}' not found`);

  if (!guildID)
    return d.error(
      `:x: guildID field not provided in \`$deleteServerVar${inside}\``
    );
let old = await d.client.db.get("main",`${variable}_${guildID}`) 

old = old ? old : {key: variable,value:d.client.variables[variable]}
  await d.client.db.delete("main", `${variable}_${guildID}`);
d.client.emit("VARIABLE_DELETE",d.client,d.client.db,variable,old.key,old.value,"server",Date.now())
  return {
    code: code.replaceLast(`$deleteServerVar${inside}`, ""),
  };
};
