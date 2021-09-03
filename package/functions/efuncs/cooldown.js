const ms = require("ms");
const {ErrorHandler} = require("../../Handler/parsers.js")


const parse = require("parse-ms");
const toParse = require("ms-parser");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$cooldown").length - 1;

  const inside = code.split("$cooldown")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const time = fields.shift();

  const errorMessage = fields.join(";");

  if (!ms(time))
    return d.error(`${d.func}: Invalid time '${time}' in ${inside}`);

  const item = await d.client.db.get(
    d.client.db.tables[0],
    `cooldown_${d.command.name}_${d.message.guild.id}_${d.message.author.id}`
  );

  if (item && ms(time) - (Date.now() - Number(item["value"])) > 999) {
    return ErrorHandler(
      d,
      errorMessage.split("%time%").join(
        toParse(
          Object.entries(parse(ms(time) - (Date.now() - Number(item["value"]))))
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
    d.client.db.set(
      d.client.db.tables[0],
      `cooldown_${d.command.name}_${d.message.guild.id}_${d.message.author.id}`,
      Date.now()
    );
  }

  return {
    code: code.replaceLast(`$cooldown${inside}`, ""),
  };
};
