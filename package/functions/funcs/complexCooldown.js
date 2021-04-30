const ms = require("ms");
const error = require("../../handlers/errors.js");
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
      `:x: Invalid cooldown type '${type}' in \`$complexCooldown${inside}\``
    );

  if (!time)
    return d.error(
      `:x: Invalid time '${time}' in \`$complexCooldown${inside}\``
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
    return error(
      d,
      errorMessage.split("%time%").join(
        toParse(
          Object.entries(parse(time - (Date.now() - Number(item.value))))
            .map((x, y) => {
              if (x[1] > 0 && y < 4) return `${x[1]}${x[0][0]}`;
              else return undefined;
            })
            .filter((e) => e)
            .join("")
        ).string
      )
    );
  } else {
    d.client.db.set(`main`, format, Date.now());
  }

  return {
    code: code.replaceLast(`$complexCooldown${inside}`, ""),
  };
}

module.exports = complexCooldown;
