const footer = (d) => {
  const r = d.command.code.split("$footer").length;

  if (r >= 3)
    return d.message.channel.send(`❌ Can't use more than one $footer. `);

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const [text, url] = inside.splits;

  return {
    code: d.command.code.replaceLast(`$footer${inside}`, ""),
    embed: d.embed.setFooter(text.addBrackets(), url),
  };
};

module.exports = footer;
