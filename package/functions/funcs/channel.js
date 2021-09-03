const ms = require("parse-ms");
const moment = require("moment");

module.exports = async (d) => {
  let code = d.command.code;

  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let [id=d?.command?.id,option] = inside.splits;
    const channel = await d.util.getChannel(d,id) 
    if(!channel) return d.error( 
       d.aoiError.functionErrorResolve(d,"channel",{inside}) 
        )
let data = {
    name:channel.name,
    id:channel.id,
    mention:channel.toString() ,
    createdAt:channel.createdAt,
    createdTimestamp:channel.createdTimestamp, 
    guildId:channel.guildId, 
    type:channel.type,
    parentId: channel.parentId,
    lastMessageId: channel.lastMessageId,
    lastPinAt:channel.lastPinAt,
    nsfw:channel.nsfw, 
    topic:channel.topic,
    permsLocked:channel.permissionsLocked,
    position:channel.position,
    rawPosition:channel.rawPosition,
    viewable:channel.viewable,
    manageable:channel.manageable,
    slowmode: channel.rateLimitPerUser 
}

  return {
    code: code.replaceLast(`$channel${inside}`, data[option]??""),
  };
};
