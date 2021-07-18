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
    return d.error(`\`${d.func}: Missing option in 2nd field of ${inside}\``);
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
    return d.error(`\`${d.func}: Invalid option in 2nd field of ${inside}\``);

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