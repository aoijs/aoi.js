const username = async (d) => {
  let code = d.command.code;

  const inside = d.unpack();

  if (!d.inside(inside)) {
    const user = await d.client.users.fetch(inside.inside).catch((err) => {});

    if (!user) return d.error(`❌ Invalid user ID in \`$username${inside}\``);

    code = code.replaceLast(
      `$username${inside}`,
      user.username.deleteBrackets()
    );
  } else {
    code = code.replaceLast(
      "$username",
      d.message.author.username.deleteBrackets()
    );
  }

  return {
    code: code,
  };
};

module.exports = username;
