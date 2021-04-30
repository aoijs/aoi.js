module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [variable, messageID = d.message.id] = inside.splits;

  if (d.client.variables[variable] === undefined)
    return d.error(`:x: Variable '${variable}' not found`);

  if (!messageID)
    return d.error(
      `:x: messageID field not provided in \`$deleteMessageVr${inside}\``
    );

  await d.client.db.delete("main", `${variable}_${messageID}`);

  return {
    code: code.replaceLast(`$deleteMessageVar${inside}`, ""),
  };
};
