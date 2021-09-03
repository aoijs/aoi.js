const keyPerms = require("../../utils/permissions.js");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();

  if (inside.inside) {
    const [userID, separator = ", "] = inside.splits;

    const member = await d.message.guild.members
      .fetch(userID)
      .catch((err) => {});

    if (!member)
      return d.error(`:x: Invalid user ID in \`$userPerms${inside}\``);

    return {
      code: code.replaceLast(
        `$userPerms${inside}`,
        member.permissions
          .toArray()
          .filter((perm) => Object.values(keyPerms).includes(perm))
          .map((perm) =>
            perm
              .split("_")
              .map((word) =>
                word.toLowerCase().replace(word.toLowerCase()[0], word[0])
              )
              .join(" ")
          )
          .join(", ")
      ),
    };
  } else {
    return {
      code: code.replaceLast(
        `$userPerms`,
        d.message.member.permissions
          .toArray()
          .filter((perm) => Object.values(keyPerms).includes(perm))
          .map((perm) =>
            perm
              .split("_")
              .map((word) =>
                word.toLowerCase().replace(word.toLowerCase()[0], word[0])
              )
              .join(" ")
          )
          .join(", ")
      ),
    };
  }
};
