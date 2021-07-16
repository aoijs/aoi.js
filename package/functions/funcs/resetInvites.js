module.exports = async (d) => {
  let code = d.command.code;

  const inside = d.unpack();
  const [guild = d.message.guild.id, userID] = inside.splits;

  if (!d.client.guilds.cache.has(guild))
    return d.error(`\`${d.func}: Invalid guild ID in ${inside.total}\``);

  let success;

  if (userID) {
    const user = await d.client.users.fetch(userID).catch((err) => {});

    if (!user)
      return d.error(`\`${d.func}: Invalid user ID in ${inside.total}\``);

    success = await d.client.db.delete(
      "main",
      `invite-tracker_${guild}_${user.id}`
    );
  } else {
    const all = await d.client.db.all({
      filter: (x) => x.key.startsWith(`invite-tracker_${guild}_`),
    });

    success = await Promise.all(
      all.map((x) => d.client.db.delete("main", x.key))
    ).then((bools) => bools.every((bool) => bool));
  }

  return {
    code: code.replaceLast(`$resetInvites${inside}`, success),
  };
};
