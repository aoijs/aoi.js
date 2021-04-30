module.exports = (d) => {
  //gay const = dm.user.client.message(stfu);
  const code = d.command.code;

  const r = code.split("$findServerChannel").length - 1;

  const inside = code.split("$findServerChannel")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const returnChannel = ["yes", "no"].includes(fields[fields.length - 1])
    ? fields.pop()
    : "yes";

  const option = fields.join(";").addBrackets();

  const manager = d.message.guild.channels.cache;

  const c =
    manager.get(option) ||
    manager.find((c) => c.name.toLowerCase() === option.toLowerCase()) ||
    d.message.mentions.channels.first() ||
    (returnChannel === "yes" ? d.message.channel : "");

  return {
    code: code.replaceLast(`$findServerChannel${inside}`, c.id),
  };
};
