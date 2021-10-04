const ms = require("parse-ms");
const parse = require("ms-parser");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$creationDate").length - 1;

  const inside = code.split("$creationDate")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [option, date = "date"] = inside.splits;

  let m;

  let opt =
    d.client.guilds.cache.get(option) ||
    d.client.users.cache.get(option) ||
    d.message.guild.roles.cache.get(option) ||
    d.client.channels.cache.get(option) ||
    d.client.emojis.cache.get(option) ||
    d.message.channel.messages.cache.get(option);

  if (!opt) {
    opt = await d.client.users.fetch(option).catch((err) => {});

    if (!opt) return d.error(`:x: Invalid ID in \`$creationDate${inside}\``);
  }

  if (date === "ms") {
    return {
      code: code.replaceLast(`$creationDate${inside}`, opt.createdTimestamp),
    };
  }

  if (date === "date") {
    m = new Date(opt.createdTimestamp).toLocaleString("en-US", {
      timeZone: d.timezone,
    });
  } else {
    m = parse(
      Object.entries(ms(Date.now() - opt.createdTimestamp))
        .map((x, y) => {
          if (x[1] && y < 4) return `${x[1]}${x[0][0]}`;
          return undefined;
        })
        .filter((e) => e)
        .join("")
    ).string;
  }

  return {
    code: code.replaceLast(`$creationDate${inside}`, m),
  };
};
