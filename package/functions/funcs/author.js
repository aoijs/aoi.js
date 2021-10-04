const author = (d) => {
  const r = d.command.code.split("$author[").length - 1;

  if (r >= 3)
    return d.message.channel.send(`❌ Can't use more than one $author.`);

  const inside = ("[" + d.command.code.split("$author[")[r]).after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [text, url = "", link = ""] = inside.splits;

  return {
    code: d.command.code.replaceLast(`$author${inside}`, ""),
    embed: d.embed.setAuthor(
      text.addBrackets(),
      url.addBrackets(),
      link.addBrackets()
    ),
  };
};

module.exports = author;
