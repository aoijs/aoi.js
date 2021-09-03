const moment = require("moment");
const ms = require("parse-ms");

module.exports = async (d) => {
  let code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  let [id, option] = inside.splits;

  let ROLE;
  try {
    ROLE = d.client.guilds.cache
      .find((g) => g.roles.cache.has(id))
      .roles.cache.get(id);
  } catch {
    ROLE = { guild: {} };
  }

  let result = option.toLowerCase();

  if (!result)
    return d.error(`:x: Missing option in 2nd field of \`$role${inside}\`.`);
  if (
    ![
      "created",
      "hex",
      "id",
      "isdeleted",
      "iseditable",
      "ishoisted",
      "ismanaged",
      "ismentionable",
      "mention",
      "name",
      "position",
      "rawposition",
      "guildid",
      "guildname",
      "usercount",
      "timestamp",
    ].includes(result)
  )
    return d.error(`:x: Invalid option in 2nd field of \`$role${inside}\`.`);

  if (!ROLE & (result !== "isdeleted")) result = undefined;

  switch (result) {
    case "name":
      result = ROLE.name;
      break;
    case "id":
      result = ROLE.id;
      break;
    case "mention":
      result = ROLE.toString(id);
      break;
    case "created":
      result = moment(ROLE.createdAt).format("LLLL");
      break;
    case "timestamp":
      result = Object.entries(ms(Date.now() - ROLE.createdTimestamp))
        .map((x, y) => {
          if (x[1] > 0 && y < 4) return `${x[1]} ${x[0]}`;
        })
        .filter((x) => x)
        .join(", ");
      if (!result) result = undefined;
      break;
    case "hex":
      result = ROLE.hexColor.replace("#", "");
      break;
    case "isdeleted":
      let ROLEE = d.client.guilds.cache.find((g) => g.roles.cache.get(id));
      if (!ROLEE & (ROLEE === undefined)) result = true;
      else result = ROLEE.deleted;
      break;
    case "iseditable":
      result = ROLE.editable;
      break;
    case "ishoisted":
      result = ROLE.hoist;
      break;
    case "ismanaged":
      result = ROLE.managed;
      break;
    case "ismentionable":
      result = ROLE.mentionable;
      break;
    case "position":
      result = ROLE.position;
      break;
    case "rawposition":
      result = ROLE.rawPosition;
      break;
    case "guildid":
      result = ROLE.guild;
      break;
    case "guildname":
      result = ROLE.guild.name;
      break;
    case "usercount":
      const Role = d.client.guilds.cache.find((g) => g.roles.cache.get(id));
      result = Role.members.cache.filter((m) => m.roles.cache.has(id)).size;
    default:
      undefined;
      break;
  }

  return {
    code: code.replaceLast(`$role${inside}`, result),
  };
};

// const moment = require("moment")

// const role = async (client, message, args, name, code) => {

//     let r = code.split("$role[").length - 1

//     let inside = code.split("$role[")[r].split("]")[0]

//     let [id, option] = inside.split(";")

//     let role = message.guild.roles.cache.get(id) || message.guild.roles.cache.find(role => role.id === inside)

//  let opt = option

//  if(!opt) return message.channel.send(`:x: Missing option in 2nd field of \`$role[${inside}]\`.`)
//  if(![
//     "created",
//     "hex",
//     "id",
//     "isdeleted",
//     "iseditable",
//     "ishoisted",
//     "ismanaged",
//     "ismentionable",
//     "mention",
//     "name",
//     "postition",
//     "rawposition",
//     "server",
//     "servername",
//     "usercount"
// ].includes(opt)) return message.channel.send(`:x: Invalid option in 2nd field of \`$role[${inside}]\`.`)

//     if(opt === "name") opt = role.name || undefined
//         else if(opt === "id") opt = role.id || undefined
//         else if(opt === "mention") opt = role.toString(id) || undefined
//         else if(opt === "ismentionable") opt = role.mentionable || undefined
//         else if(opt === "ishoisted") opt = role.hoist || undefined
//         else if(opt === "position") opt = role.position || undefined
//         else if(opt === "rawposition") opt = role.rawPosition || undefined
//         else if(opt === "ismanaged") opt = role.managed || undefined
//         else if(opt === "iseditable") opt = role.editable || undefined
//         else if(opt === "server") opt = role.guild || undefined
//         else if(opt === "servername") opt = role.guild.name || undefined
//         else if(opt === "hex") opt = role.hexColor.replace("#", "") || undefined
//         else if(opt === "usercount") opt = message.guild.members.cache.filter(m => m.roles.cache.has(role.id)).size
//         else if(opt === "created") opt = moment(role.createdAt).format("LLLL")
//         if(role.deleted === undefined) opt = true
//         else if(opt === "isdeleted") opt = role.deleted

//         if(!role) return message.channel.send(`:x: Invalid role ID in 1st field of \`$role[${inside}]\`.`)

//      code = code.replaceLast(`$role[${inside}]`, opt)

//      return {
//          code: code
//      }
//  }

//  module.exports = role;
