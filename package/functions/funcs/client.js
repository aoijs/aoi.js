const moment = require("moment");
const ms = require("parse-ms");

module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let option = inside.inside;

  /* Returns the date and time the bot came online */
  let readyat = moment(d.client.readyAt).format("LLLL");

  /* Returns how long ago the bot came online */
  let readytimestamp = Object.entries(ms(Date.now() - d.client.readyTimestamp))
    .map((x, y) => {
      if (x[1] > 0 && y < 4) return `${x[1]} ${x[0]}`;
    })
    .filter((x) => x)
    .join(", ");

  if (!option) return d.error(`:x: Missing property in \`$client${inside}\`.`);
  if (
    ![
      "name",
      "id",
      "tag",
      "mention",
      "discriminator",
      "discrim",
      "avatar",
      "presence",
      "activity",
      "lastmessagechannelid",
      "lastmcid",
      "lastmid",
      "lastmessageid",
      "readyat",
      "readytimestamp",
    ].includes(option)
  )
    return d.error(`:x: Invalid property in \`$client${inside}\`.`);

  switch (option) {
    case "name":
      option = d.client.user.username;
      break;
    case "id":
      option = d.client.user.id;
      break;
    case "tag":
      option = d.client.user.tag;
      break;
    case "mention":
      option = `<@${d.client.user.id}>`;
      break;
    case "discriminator":
      option = d.client.user.discriminator;
      break;
    case "discrim":
      option = d.client.user.discriminator;
      break;
    case "readytimestamp":
      option = readytimestamp;
      break;
    case "avatar":
      option = d.client.user.displayAvatarURL();
      break;
    case "presence":
      option = d.client.presence.status;
      break;
    case "activity":
      option = d.client.presence.activities;
      if (d.client.presence.activities[0]) {
        option.activity = d.client.presence.activities[0].name;
      } else option = "None";
      break;
    case "lastmessagechannelid":
      option = d.client.user.lastMessageChannelID;
      break;
    case "lastmcid":
      option = d.client.user.lastMessageChannelID;
      break;
    case "lastmessageid":
      option = d.client.user.lastMessageID;
      break;
    case "lastmid":
      option = d.client.user.lastMessageID;
      break;
    case "readyat":
      option = readyat;
      break;
    default:
      undefined;
  }

  return {
    code: d.command.code.replaceLast(`$client${inside}`, option),
  };
};
