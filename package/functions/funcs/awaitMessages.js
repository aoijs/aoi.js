
const ms = require("ms");
const {ErrorHandler} = require("../../Handler/parsers.js");

module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);
  if (err) return d.error(err);
  let [
    channelId=d.channel.id,
    messageId=d.message.id,
    userFilter,
    time,
    responseOrResponses,
    commandOrCommands,
    error,
    userId,
    data={} 
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
  if (userId) {
    let user = await d.client.users.cache.get(userId);
  if(!user){
      d.client.users.fetch(userId).catch(e=>undefined)
  }
    if (!user)
      return d.error(`$awaitMessage: Invalid User in ${inside}`);
    channel = await user.createDM();
  }
    try{
data = JSON.parse(data)
        }
    catch (e){
        d.error(`${d.func}: Invalid Data Provided In ${inside}`)
    }
  channel
    .awaitMessages({filter, 
      max: 1,
      time: ms(time),
      errors: ["time"],
    })
    .then(async(collected) => {
      const m = collected.first();

      const cmd =
        responseOrResponses === "everything"
          ? d.client.cmd.awaited.find((c) => c.name === commandOrCommands)
          : d.client.cmd.awaited.find(
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
        return d.error(`$awaitMessage:Missing Await Command:${cmd} `);

    await  d.interpreter(d.client, m, m.content.split(" "), cmd,d.client.db,false, undefined,{awaitData:data});
    })
    .catch((err) => {
      if (!err || !err.message) ErrorHandler(d, error);
      else if (err.message) return d.error(`${d.func}:${err.message}`);
    });

  return {
    code: d.command.code.replaceLast(`$awaitMessages${inside.total}`, ""),
  };
};
