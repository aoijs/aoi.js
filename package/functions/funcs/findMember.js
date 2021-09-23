module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const returnAuthor = inside.splits.length > 1 ? inside.splits.pop() : "yes";
  const option = inside.splits.join(";").trim() || d.message.channel.id; //#channel

  let u =
    d.message.guild.members.cache.get(option) ||
    d.message.guild.members.cache.find(
      (m) =>
        m.user.tag.toLowerCase() === option.toLowerCase() ||
        m.user.username.toLowerCase() === option.toLowerCase() ||
        m.displayName.toLowerCase() === option.toLowerCase() || m.user.username.toLowerCase().includes(option.toLowerCase()) || m.displayName.toLowerCase().includes(option.toLowerCase())
    ) || 
    (await d.message.guild.members.fetch(option).catch(d.noop)) ||
    (returnAuthor === "yes" ? d.message.member : { id: "undefined" });
   if(u.id === "undefined") u = getMemberFromMention(option);
  return {
    code: code.replaceLast(`$findMember${inside}`, u.id),
  };

function getMemberFromMention(mention) {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return {id: "undefined"};
	const id = matches[1];
	return {id: d.message.guild.members.cache.get(id)};
}
};
