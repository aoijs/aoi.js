const color = (d) => {
  const r = d.command.code.split("$color").length;

  if (r >= 3)
    return d.message.channel.send(`\`${d.func}: Can't use more than one\``);

  const inside = d.command.code.split("$color")[1].after();

  return {
    code: d.command.code.replaceLast(`$color${inside}`, ""),
    embed: d.embed.setColor(inside.inside),
  };
};

module.exports = color;
