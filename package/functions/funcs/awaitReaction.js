const {ErrorHandler} = require("../../Handler/parsers.js");
const ms = require("ms");
module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack() 
  const err = d.inside(inside);
  if (err) return d.error(err);
  let [
    channelId=d.chnnel.id,
    messageId=d.message.id,
    userFilter,
    time,
    reactionOrReactions,
    commandOrCommands,
    errorMessage,
    deleteOnCollect = "no",
    max=1,
    data={}
  ] = inside.splits;
try{
    data = JSON.parse(data) 
    }
    catch(e){
        d.error(`${d.func}: Invalid Data Provided In ${d.inside}`)
    }
  if (!ms(time))
    return d.error(`Invalid time '${time}' in \`$awaitReaction${inside}\``);

 let channel = d.client.channels.get(channelId)
 if (!channel) channel = await d.client.channels.fetch(channelId).cache(err=>undefined)
if(!channel) return d.error(`${d.func}: Invalid Channel Provided In ${inside}`) 
 let message = channel.messages.cache.get(messageId) 
 if(!message) message = await channel.messages.fetch(messageId).catch(err => undefined) 
    if(!message) return d.error(`${d.func}:Invalid MessageId Provided In ${inside}`) 
  for (const reaction of reactionOrReactions.split(" ").join("").split(",")) {
    const r = await message.react(reaction).catch((rr) => {});
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
  }
  const collected = await message.awaitReactions({filter,
      max: max,
      time: ms(time),
      errors: ["time"],
    })
    .catch((err) => {});
let tries = 0 
  if (!collected) {
    return ErrorHandler(d, errorMessage);
  }
  if (deleteOnCollect === "yes") message.delete()
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
  const cmd = d.client.cmd.awaited.find((c) => c.name.toLowerCase() === command.toLowerCase());
  if (!cmd) return d.error(`${d.func}: AwaitedCommand '${command}' not found!`);
  await d.interpreter(
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
