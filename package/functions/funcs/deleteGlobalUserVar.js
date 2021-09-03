module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [variable, userID = d.message.author.id] = inside.splits;

  if (d.client.variables[variable] === undefined)
    return d.error(`:x: Variable '${variable}' not found`);

  if (!userID)
    return d.error(
      `:x: userID field not provided in \`$deleteGlobalUserVar${inside}\``
    );
let old = await d.client.db.get("main",`${variable}_${userID}`) 

old = old ? old : {key: variable,value:d.client.variables[variable]}
  await d.client.db.delete("main", `${variable}_${userID}`);
d.client.emit("VARIABLE_DELETE",d.client,d.client.db,variable,old.key,old.value,"globalUser",Date.now())
  return {
    code: code.replaceLast(`$deleteGlobalUserVar${inside}`, ""),
  };
};
