module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [variable, messageID = d.message.id] = inside.splits;

  if (d.client.variables[variable] === undefined)
    return d.error(`\`VariableError: '${variable}' not found\``);

  if (!messageID)
    return d.error(
      `\`${d.func}: messageID field not provided in ${inside}\``
    );
let old = await d.client.db.get("main",`${variable}_${messageID}`) 

old = old ? old : {key: variable,value:d.client.variables[variable]}
  await d.client.db.delete("main", `${variable}_${messageID}`);
d.client.emit("VARIABLE_DELETE",d.client,d.client.db,variable,old.key,old.value,"message",Date.now())
  return {
    code: code.replaceLast(`$deleteMessageVar${inside}`, ""),
  };
};
