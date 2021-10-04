module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$boostingSince").length - 1;

  const data = code.split("$boostingSince")[r].after();

  const [userID = d.message.author.id, option = "date"] = data.splits;

  const member = await d.message.guild.members
    .fetch(userID)
    .catch((err) => null);

  if (!userID)
    return d.message.channel.send(
      `❌ Invalid user ID in \`$boostingSince${data.total}\``
    );

  return {
    code: code.replaceLast(
      `$boostingSince${data.total}`,
      member.premiumSinceTimestamp
        ? option === "ms"
          ? member.premiumSinceTimestamp
          : new Date(member.premiumSinceTimestamp)
        : ""
    ),
  };
};
