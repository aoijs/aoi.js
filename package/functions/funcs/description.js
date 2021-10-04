const description = (d) => {
  const r = d.command.code.split("$description").length;

  if (r >= 3)
    return d.message.channel.send(`❌ Can't use more than one $description.`);

  const inside = d.command.code.split("$description")[1].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  return {
    code: d.command.code.replaceLast(`$description${inside}`, ""),
    embed: d.embed.setDescription(inside.inside.addBrackets()),
  };
};

module.exports = description;
