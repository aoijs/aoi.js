const dm = async (d) => {
  let code = d.command.code,
    user;

  if (code.split("$dm").length >= 3)
    return d.message.channel.send(`❌ Can't use more than one $dm`);

  const after = code.split("$dm")[1].after();

  if (after.inside) {
    const inside = after.inside;

    user = await d.client.users.cache.get(inside);

    if (!user) return d.error(`❌ Invalid user ID in \`$dm${after}\``);

    code = code.replaceLast(`$dm${after}`, "");
  } else {
    code = code.replaceLast(`$dm`, "");
    user = d.message.author;
  }

  return {
    code: code,
    channel: user,
  };
};

module.exports = dm;
