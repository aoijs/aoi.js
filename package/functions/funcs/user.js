const moment = require("moment");
const ms = require("parse-ms");

module.exports = async (d) => {
  let code = d.command.code;

  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  let [id, option] = inside.splits;

  let user =
    d.client.users.cache.get(id) ||
    (await d.client.users.fetch(id).catch(d.noop));

  if (!user)
    return d.error(`❌ Invalid user ID in 1st field of \`$user${inside}\`.`);

  let ch = d.message.channel.id;
  let result = option.toLowerCase();

  if (!result)
    return d.error(`❌ Missing option in 2nd field of \`$user${inside}\`.`);
  if (
    ![
      "avatar",
      "created",
      "discrim",
      "id",
      "isbot",
      "istyping",
      "lastmessagechannelid",
      "lastmessageid",
      "mention",
      "name",
      "tag",
      "timestamp",
    ].includes(result.toLowerCase())
  )
    return d.error(`❌ Invalid option in 2nd field of \`$user${inside}\`.`);

  switch (result) {
    case "avatar":
      result = user.displayAvatarURL(id) || undefined;
      break;
    case "created":
      result = moment(user.createdAt).format("LLLL") || undefined;
      break;
    case "discrim":
      result = user.discriminator || undefined;
      break;
    case "id":
      result = user.id || undefined;
      break;
    case "isbot":
      result = user.bot;
      break;
    case "istyping":
      result = user.typingIn(ch) || false;
      break;
    case "lastmessagechannelid":
      result = user.lastMessageChannelID || undefined;
      break;
    case "lastmessageid":
      result = user.lastMessageID || undefined;
      break;
    case "mention":
      result = user.toString(id) || undefined;
      break;
    case "name":
      result = user.username || undefined;
      break;
    case "tag":
      result = user.tag || undefined;
      break;
    case "timestamp":
      result = Object.entries(ms(Date.now() - user.createdTimestamp))
        .map((x, y) => {
          if (x[1] > 0 && y < 4) return `${x[1]} ${x[0]}`;
        })
        .filter((x) => x)
        .join(", ");
      if (!result) result = undefined;
      break;

    default:
      undefined;
  }

  return {
    code: code.replaceLast(`$user${inside}`, result),
  };
};
