const embed = require("../../handlers/errors.js");
const ms = require("ms");
const interpreter = require("../../interpreter.js");
module.exports = async (d) => {
  const code = d.command.code;

  const inside = code
    .split("$awaitReaction")
    [code.split("$awaitReaction").length - 1].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let [
    userFilter,
    time,
    botMsg,
    reactionOrReactions,
    commandOrCommands,
    errorMessage,
    deleteOnCollect = "no",
  ] = inside.splits;

  if (!ms(time))
    return d.error(`Invalid time '${time}' in \`$awaitReaction${inside}\``);

  const m = await embed(d, botMsg, "object");

  for (const reaction of reactionOrReactions.split(" ").join("").split(",")) {
    const r = await m.react(reaction).catch((rr) => {});

    if (!r) return d.error(`:x: Failed to react with '${reaction}'`);
  }

  const filter = (reaction, user) => {
    return reactionOrReactions
      .split(" ")
      .join("")
      .split(",")
      .some(
        (rc) =>
          rc.includes(reaction.emoji.name) || rc.includes(reaction.emoji.id)
      ) &&
      d.client.user.id !== user.id &&
      userFilter === "everyone"
      ? true
      : user.id === userFilter;
  };

  const collected = await m
    .awaitReactions(filter, {
      max: 1,
      time: ms(time),
      errors: ["time"],
    })
    .catch((err) => {});

  if (!collected) {
    return embed(d, errorMessage);
  }

  if (deleteOnCollect === "yes") m.delete();

  const reaction = collected.first();

  const command = commandOrCommands.split(" ").join("").split(",")[
    reactionOrReactions
      .split(" ")
      .join("")
      .split(",")
      .findIndex(
        (rc) =>
          rc.includes(reaction.emoji.name) || rc.includes(reaction.emoji.id)
      )
  ];

  if (!command)
    return d.error(`:x: Command '${command}' not found! (internal error)`);

  const cmd = d.client.awaited_commands.find((c) => c.name === command);

  if (!cmd) return d.error(`:x: Command '${command}' not found!`);

  await interpreter(
    d.client,
    {
      author: reaction.users.cache.find(
        (u) =>
          (userFilter === "everyone" ? true : userFilter === u.id) &&
          d.client.user.id !== u.id
      ),
      guild: d.message.guild,
      channel: d.message.channel,
      id: d.message.id,
      mentions: d.message.mentions,
      reactions: d.message.reactions,
      member: await d.message.guild.members.fetch(
        reaction.users.cache.find(
          (u) =>
            (userFilter === "everyone" ? true : userFilter === u.id) &&
            d.client.user.id !== u.id
        ).id
      ),
    },
    [],
    cmd
  );

  return {
    code: code.replaceLast(`$awaitReaction${inside}`, ""),
  };
};
