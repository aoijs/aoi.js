const interpreter = require("../../interpreter");
const ms = require("ms");
const embed = require("../../handlers/errors");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$awaitMessages").length - 1;

  const inside = code.split("$awaitMessages")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [
    userFilter,
    time,
    responseOrResponses,
    commandOrCommands,
    error,
    userID,
  ] = inside.splits;

  const filter = (m) => {
    return (
      (userFilter === "everyone" ? true : userFilter === m.author.id) &&
      (responseOrResponses === "everything"
        ? true
        : responseOrResponses
            .toLowerCase()
            .split(" ")
            .join("")
            .split(",")
            .includes(m.content.toLowerCase())) &&
      !m.author.bot
    );
  };

  let channel = d.message.channel;

  if (userID) {
    const user = await d.client.users.fetch(userID).catch((err) => null);

    if (!user)
      return d.error(`❌ Invalid user ID in \`$awaitMessages${inside}\``);

    channel = await user.createDM();
  }

  channel
    .awaitMessages(filter, {
      max: 1,
      time: ms(time),
      errors: ["time"],
    })
    .then((collected) => {
      const m = collected.first();

      const cmd =
        responseOrResponses === "everything"
          ? d.client.awaited_commands.find((c) => c.name === commandOrCommands)
          : d.client.awaited_commands.find(
              (c) =>
                c.name ===
                commandOrCommands.split(" ").join("").split(",")[
                  responseOrResponses
                    .split(" ")
                    .join("")
                    .split(",")
                    .findIndex(
                      (e) => e.toLowerCase() === m.content.toLowerCase()
                    )
                ]
            );

      if (!cmd)
        return d.error(`❌ Awaited command ${m.content} does not exist`);

      interpreter(d.client, m, m.content.split(" "), cmd);
    })
    .catch((err) => {
      if (!err || !err.message) embed(d, error);
      else if (err.message) return d.error(`❌ ${err.message}`);
    });

  return {
    code: d.command.code.replaceLast(`$awaitMessages${inside.total}`, ""),
  };
};
