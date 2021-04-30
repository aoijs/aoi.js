const Discord = require("discord.js");
module.exports = async (d) => {
  const code = d.command.code;

  let separator = ", ";

  const r = code.split("$botOwnerID").length - 1;
  const checker = code.split("$botOwnerID")[r].after();

  const anything = checker.inside ? checker.inside : undefined;
  if (anything) separator = anything;

  const data = await d.client.fetchApplication();
  const owner = data.owner;

  return {
    code: code.replaceLast(
      `$botOwnerID${checker}`,
      owner instanceof Discord.User
        ? owner.id
        : (() => {
            const owners = [
              data.owner.ownerID,
              ...data.owner.members
                .filter((e) => data.owner.ownerID !== e.user.id)
                .map((u) => u.user.id),
            ];

            return owners.join(separator);
          })()
    ),
  };
};
