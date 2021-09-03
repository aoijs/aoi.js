const ms = require("ms");
const interpreter = require("../../interpreter");
const {ErrorHandler} = require('../../Handler/parsers.js') 

module.exports = async (d) => {
  const code = d.command.code;
  const inside =d.unpack() 
  const err = d.inside(inside);
  if (err) return d.error(err);
  const [
    userFilter,
    time,
    reactionOrReactions,
    commandOrCommands,
    errorMessage,
      data={} 
  ] = inside.splits;
  const reactions = reactionOrReactions.addBrackets().split(",");
  const commands = commandOrCommands.addBrackets().split(",");
  const timer = ms(time);
  if (!timer)
    return d.error(`❌ Invalid time in \`$awaitCmdReaction${inside}\``);
  const filter = (r, u) => {
    return userFilter === "everyone"
      ? d.client.user.id !== u.id
      : userFilter.split(",").some((id) => u.id === id) &&
          reactions.some((a) => a === r.emoji.toString());
  };
  d.message
    .awaitReactions({filter,
      time: timer,
      max: 1,
      errors: ["time"],
    })
    .then(async (collected) => {
      const user = collected.first().users.cache.last();
      const index = reactions.findIndex(
        (r) => r === collected.first().emoji.toString()
      );
      const cmd = d.client.cmd.awaited.find(
        (c) => c.name === commands[index]
      );
      if (!cmd)
        return d.error(`$awaitCmdReaction:Await Command :'${commands[index]}' not found.`);
      const msg = Object.assign(Object.create(d.message), d.message);
      msg.author = user;
      msg.member = d.message.guild
        ? await d.message.guild.members.fetch(user.id).catch((err) => null)
        : d.message.member;
      interpreter(d.client, msg, d.args, cmd,d.client.db,false, undefined,{awaitData:data});
    })
    .catch((err) => {
      if (!err.message) {
        ErrorHandler(d, errorMessage, undefined, d.message.channel);
      } else ErrorHandler(d, err.message, undefined, d.message.channel);
    });
  return {
    code: code.replaceLast(`$awaitCmdReaction${inside.total}`, ""),
  };
};