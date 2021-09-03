module.exports = (d) => {
  //gay const = dm.user.client.message(stfu);
  const code = d.command.code;

  const r = code.split("$findChannel").length - 1;

  const inside = code.split("$findChannel")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const returnChannel = ["yes", "no"].includes(fields[fields.length - 1])
    ? fields.pop()
    : "yes";

  const option = fields.join(";");

  const manager = d.client.channels.cache;

  const c =
    manager.get(option) ||
    manager.find(
      (c) => c.name && c.name.toLowerCase() === option.toLowerCase()
    ) ||
    d.message.mentions.channels.first() ||
    (returnChannel === "yes" ? d.message.channel : "");

  return {
    code: code.replaceLast(`$findChannel${inside}`, c.id),
  };
};
