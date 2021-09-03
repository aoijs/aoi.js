const userAvatar = async (d) => {
  let code = d.command.code;

  const inside = d.unpack();
  if (!inside.splits[0]) {
    inside.splits.shift();
    inside.splits.unshift(d.message.author.id);
  }

  const [id, size = "2048", dynamic = "yes"] = inside.splits || [];

  const user = await d.client.users.fetch(id).catch(d.noop);

  if (!user) return d.error(`❌ Invalid user ID in \`$userAvatar${inside}\``);

  code = code.replaceLast(
    `$userAvatar${inside}`,
    user.displayAvatarURL({
      dynamic: dynamic === "yes" ? true : false,
      size: Number(size),
    })
  );

  return {
    code: code,
  };
};

module.exports = userAvatar;
