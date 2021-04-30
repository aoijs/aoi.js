module.exports = async (d) => {
  let code = d.command.code;

  const r = code.split("$addField").length - 1;

  const inside = code.split("$addField")[r].after();

  const [title, value, inline = "no"] = inside.splits;

  if (!value || !value.length)
    return d.error(`:x: Fields can't be empty in \`$addField${inside.total}\``);

  d.embed.addField(title.addBrackets(), value.addBrackets(), inline === "yes");

  code = code.replaceLast(`$addField${inside.total}`, "");
  return {
    code: code,
    embed: d.embed,
  };
};
