module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const returnAuthor = inside.splits.length > 1 ? inside.splits.pop() : "yes";
  const user = inside.splits.join(";").trim() || d.message.channel.id;

  let u =
    d.client.users.cache.get(user) ||
    d.message.mentions.users.first() ||
    d.client.users.cache.find(
      (m) =>
        m.username.addBrackets().toLowerCase() === user.toLowerCase() ||
        m.tag.toLowerCase() === user.addBrackets().toLowerCase()
    ) ||
    (await d.client.users.fetch(user).catch(d.noop)) ||
    (returnAuthor === "yes" ? d.message.author : { id: "undefined" });

  return {
    code: code.replaceLast(`$findUser${inside}`, u.id),
  };
};
