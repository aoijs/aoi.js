//bruh - ruben was gay over here/
// who ever read it

module.exports = async (d) => {
  //stfu

  const code = d.command.code;

  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const returnAuthor = inside.splits.length > 1 ? inside.splits.pop() : "yes";
  const option = inside.splits.join(";").trim() || d.message.channel.id; //#channel

  const u =
    d.message.guild.members.cache.get(option) ||
    d.message.guild.members.cache.find(
      (m) =>
        m.user.tag.toLowerCase() === option.toLowerCase() ||
        m.user.username.toLowerCase() === option.toLowerCase() ||
        m.displayName.toLowerCase() === option.toLowerCase()
    ) ||
    d.message.mentions.members.first() ||
    (await d.message.guild.members.fetch(option).catch(d.noop)) ||
    (returnAuthor === "yes" ? d.message.member : { id: "undefined" });

  return {
    code: code.replaceLast(`$findMember${inside}`, u.id),
  };
};
