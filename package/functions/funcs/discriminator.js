const discriminator = async (d) => {
  let code = d.command.code;

  const r = code.split("$discriminator").length - 1;

  const after = code.split("$discriminator")[r].after();

  if (after.inside) {
    const inside = after.inside;

    const user = await d.client.users.fetch(inside).catch((err) => {});

    if (!user)
      return d.error(`❌ Invalid user ID in \`$discriminator${after}\``);

    code = code.replaceLast(
      `$discriminator${after}`,
      user.discriminator.deleteBrackets()
    );
  } else {
    code = code.replaceLast(
      "$discriminator",
      d.message.author.discriminator.deleteBrackets()
    );
  }

  return {
    code: code,
  };
};

module.exports = discriminator;
