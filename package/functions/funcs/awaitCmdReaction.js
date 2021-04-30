const ms = require("ms");
const interpreter = require("../../interpreter");
const embed = require("../../handlers/errors");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$awaitCmdReaction").length - 1;

  const inside = code.split("$awaitCmdReaction")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [
    userFilter,
    time,
    reactionOrReactions,
    commandOrCommands,
    errorMessage,
  ] = inside.splits;

  const reactions = reactionOrReactions.addBrackets().split(",");

  const commands = commandOrCommands.addBrackets().split(",");

  const timer = ms(time);

  if (!timer)
    return d.error(`❌ Invalid time in \`$awaitCmdReaction${inside}\``);

  const filter = (r, u) => {
    return userFilter === "everyone"
      ? client.user.id !== u.id
      : userFilter.split(",").some((id) => u.id === id) &&
          reactions.some((a) => a === r.emoji.toString());
  };

  d.message
    .awaitReactions(filter, {
      time: timer,
      max: 1,
      errors: ["time"],
    })
    .then(async (collected) => {
      const user = collected.first().users.cache.last();

      const index = reactions.findIndex(
        (r) => r === collected.first().emoji.toString()
      );

      const cmd = d.client.awaited_commands.find(
        (c) => c.name === commands[index]
      );

      if (!cmd)
        return d.error(`❌ Awaited command '${commands[index]}' not found.`);

      const msg = Object.assign(Object.create(d.message), d.message);

      msg.author = user;
      msg.member = d.message.guild
        ? await d.message.guild.members.fetch(user.id).catch((err) => null)
        : d.message.member;

      interpreter(d.client, msg, d.args, cmd);
    })
    .catch((err) => {
      if (!err.message) {
        embed(d, errorMessage, undefined, d.message.channel);
      } else embed(d, err.message, undefined, d.message.channel);
    });

  return {
    code: code.replaceLast(`$awaitCmdReaction${inside.total}`, ""),
  };
};
