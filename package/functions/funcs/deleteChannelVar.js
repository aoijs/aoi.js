module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [variable, channelID = d.message.channel.id] = inside.splits;

  if (d.client.variables[variable] === undefined)
    return d.error(`\`VariableError: '${variable}' not found\``);

  if (!channelID)
    return d.error(
      `\`${d.func}: channelID field not provided in ${inside}\``
    );
let old = await d.client.db.get("main",`${variable}_${channelID}`) 
old = old ? old : {key: variable,value:d.client.variables[variable]}
  await d.client.db.delete("main", `${variable}_${channelID}`);
d.client.emit("VARIABLE_DELETE",d.client,d.client.db,variable,old.key,old.value,"channel",Date.now())
  return {
    code: code.replaceLast(`$deleteChannelVar${inside}`, ""),
  };
};
