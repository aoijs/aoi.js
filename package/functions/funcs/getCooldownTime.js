const ms = require("parse-ms");
const parse = require("ms-parser");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$getCooldownTime").length - 1;

  const inside = code.split("$getCooldownTime")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [time, type, name, id, MS = "no"] = inside.splits;

  const types = {
    globalUser: "_" + id,
    user: `_${d.message.guild.id}_${id}`,
    server: "_" + id,
    channel: "_" + id,
    all: "",
  }[type];

  if (!types)
    return d.error(`❌ Invalid cooldown type on \`$getCooldownTime${inside}\``);

  const times = require("ms")(time);

  const cd = await d.client.db
    .get("main", `cooldown_${name}${types}`)
    .then((d) => {
      return { value: d ? d.value + times - Date.now() : 0 };
    });

  return {
    code: code.replaceLast(
      `$getCooldownTime${inside}`,
      cd && cd.value > 0
        ? MS === "no"
          ? parse(
              Object.entries(ms(cd.value))
                .filter((x, y) => y < 4 && x[1])
                .map((x, y) => x[1] + x[0][0])
                .join("")
            ).string
          : cd.value
        : 0
    ),
  };
};
