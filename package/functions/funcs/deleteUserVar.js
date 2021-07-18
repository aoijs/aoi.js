module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [
    variable,
    userID = d.message.author.id,
    guildID = d.message.guild ? d.message.guild.id : "",
  ] = inside.splits;

  if (d.client.variables[variable] === undefined)
    return d.error(`\`VariableError: '${variable}' not found\``);

  if (!userID)
    return d.error(
      `\`${d.func}: userID field not provided in ${inside}\``
    );

  if (!guildID)
    return d.error(
      `\`${d.func}: guildID field not provided in ${inside}\``
    );
let old = await d.client.db.get("main",`${variable}_${guildID}_${userID}`) 

old = old ? old : {key: variable,value:d.client.variables[variable]}
  await d.client.db.delete("main", `${variable}_${guildID}_${userID}`);
d.client.emit("VARIABLE_DELETE",d.client,d.client.db,variable,old.key,old.value,"user",Date.now())
  return {
    code: code.replaceLast(`$deleteUserVar${inside}`, ""),
  };
};
