const ms = require("parse-ms");
const moment = require("moment");

module.exports = async (d) => {
  let code = d.command.code;

  let r = code.split("$channel").length - 1;

  let inside = code.split("$channel")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let [id, option] = inside.splits;

  // let ch = message.guild.channels.cache.get(id ? id : message.channel.id)

  let thischannel = d.message.channel.id;

  let CH;
  try {
    CH = d.client.guilds.cache
      .find((g) => g.channels.cache.get(id || thischannel))
      .channels.cache.get(id || thischannel);
  } catch {
    CH = { guild: {} };
  }

  if (!option)
    return d.error(`:x: Missing option in 2nd field of \`$channel${inside}\`.`);
  if (
    ![
      "created",
      "id",
      "isdeleted",
      "mention",
      "name",
      "position",
      "rawposition",
      "topic",
      "type",
      "created",
      "timestamp",
      "guildid",
      "guildname",
      "ismanageable",
      "parentid",
      "parentname",
      "isviewable",
      "isdeletable",
    ].includes(option.toLowerCase())
  )
    return d.error(`:x: Invalid option in 2nd field of \`$channel${inside}\`.`);

  switch (option) {
    case "name":
      option = CH.name;
      break;
    case "id":
      option = CH.id;
      break;
    case "isdeleted":
      let Channel = d.client.guilds.cache.find((g) =>
        g.channels.cache.get(id || thischannel)
      );
      if (!Channel & (Channel === undefined)) option = true;
      else option = Channel.deleted;
      break;
    case "mention":
      option = CH.toString(id || thischannel);
      break;
    case "position":
      option = CH.position;
      break;
    case "rawposition":
      option = CH.rawPosition;
      break;
    case "topic":
      try {
        option = CH.topic;
        if (option === (null || undefined)) option = undefined;
      } catch {
        option = undefined;
      }
      break;
    case "type":
      option = CH.type;
      break;
    case "created":
      option = moment(CH.createdAt).format("LLLL");
      break;
    case "timestamp":
      option = Object.entries(ms(Date.now() - CH.createdTimestamp))
        .map((x, y) => {
          if (x[1] > 0 && y < 4) return `${x[1]} ${x[0]}`;
        })
        .filter((x) => x)
        .join(", ");
      if (!option) option = undefined;
      break;
    case "guildid":
      option = CH.guild.id;
      break;
    case "guildname":
      option = CH.guild.name;
      break;
    case "ismanageable":
      option = CH.manageable;
      break;
    case "parentid":
      option = CH.parentID;
      break;
    case "parentname":
      option = CH.parent.name;
      break;
    case "isviewable":
      option = CH.viewable;
      break;
    case "isdeletable":
      option = CH.deletable;

    default:
      undefined;
  }

  return {
    code: code.replaceLast(`$channel${inside}`, option),
  };
};
