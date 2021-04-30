const ms = require("parse-ms");
const EmojiFullFormat = /<(a|):\D+:\d{17,19}>/g;

module.exports = async (d) => {
  let code = d.command.code;

  let r = code.split("$emoji").length - 1;

  let inside = code.split("$emoji")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  let fields = inside.splits;

  let result = fields[1];

  if (EmojiFullFormat.test(fields[0]))
    fields[0] = fields[0].split(":")[2].replace(/(\<|\>)/, "");

  let emote;
  try {
    emote = await d.message.guild.emojis.cache.get(fields[0]);
    if (!emote && result.toLowerCase() === "isdeleted") result = true;
    else if (!emote)
      return d.error(
        `:x: Invalid emoji ID in 1st field of \`$emoji${inside}\``
      );
  } catch {
    return d.error(`:x: Invalid emoji ID in 1st field of \`$emoji${inside}\``);
  }

  if (!result)
    return d.error(`:x: Missing option in 2nd field of \`$emoji${inside}\``);
  if (
    ![
      "created",
      "emoji",
      "guildid",
      "id",
      "identifier",
      "isanimated",
      "isdeleted",
      "ismanaged",
      "name",
      "url",
    ].includes(result.toLowerCase())
  )
    return d.error(`:x: Invalid option in 2nd field of \`$emoji${inside}\``);

  switch (result) {
    case "id":
      try {
        result = emote.id;
      } catch {
        result = undefined;
      }
      break;
    case "emoji":
      try {
        result = emote.toString();
      } catch {
        result = undefined;
      }
      break;
    case "isanimated":
      try {
        result = emote.animated;
      } catch {
        result = undefined;
      }
      break;
    case "name":
      try {
        result = emote.name;
      } catch {
        result = undefined;
      }
      break;
    case "url":
      try {
        result = emote.url;
      } catch {
        result = undefined;
      }
      break;
    case "isdeleted":
      try {
        result = emote.deleted;
      } catch {
        result = undefined;
      }
      break;
    case "created":
      try {
        const date = new Date(emote.createdAt);
        const weekdays = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const isPM = date.getHours() > 12 ? true : false;
        result = `${weekdays[date.getDay()]}, ${
          date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
        }:${date.getMinutes()} ${isPM ? "PM" : "AM"} ${date.getDate()} ${
          months[date.getMonth()]
        } ${date.getFullYear()}`;
      } catch (err) {
        console.log(err);
        result = undefined;
      }
      break;
    case "identifier":
      try {
        result = emote.identifier;
      } catch {
        result = undefined;
      }
      break;
    case "guildid":
      try {
        result = emote.guild;
      } catch {
        result = undefined;
      }
      break;
    case "ismanaged":
      try {
        result = emote.managed;
      } catch {
        result = undefined;
      }
  }

  return {
    code: code.replaceLast(`$emoji${inside}`, result),
  };
};
