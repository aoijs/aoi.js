const ms = require("ms");
const {ErrorHandler} = require("../../handlers/errors.js");
const parse = require("parse-ms");
const toParse = require("ms-parser");

const validTypes = ["globalUser", "channel", "server", "user", "all"];

async function complexCooldown(d) {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);

  if (err) return d.error(err);

  const type = inside.splits[0].toLowerCase();
  const time = ms(inside.splits[1]);
  const errorMessage = inside.splits.slice(2).join(";");

  if (!validTypes.includes(type))
    return d.error(
      `${d.func}: Invalid cooldown type '${type}' in ${inside}`
    );

  if (!time)
    return d.error(
      `${d.func}: Invalid time '${time}' in ${inside}`
    );

  let format = `cooldown_${d.command.name}`;

  switch (type) {
    case validTypes[0]:
      format += `_${d.message.author.id}`;

      break;
    case validTypes[1]:
      format += `_${d.message.channel.id}`;

      break;
    case validTypes[2]:
      format += `_${d.message.guild.id}`;

      break;
    case validTypes[3]:
      format += `_${d.message.guild.id}_${d.message.author.id}`;
  }

  const item = await d.client.db.get("main", format);

  if (item && time - (Date.now() - Number(item.value)) > 999) {
    d.util.sendError(d, errorMessage)
  } else {
    d.client.db.set(d.client.db.tables[0], format, Date.now());
  }

  return {
    code: code.replaceLast(`$complexCooldown${inside}`, ""),
  };
}

module.exports = complexCooldown;
