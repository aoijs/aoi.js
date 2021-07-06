const Discord = require("discord.js");

module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();

  const r = code.split("$createCollection").length - 1;

  const err = d.inside(inside);

  if (err) return d.error(err);

  const name = code.split("$createCollection")[r].after();

  if (!name.inside) return d.error(`\`${d.func}: Invalid usage in ${inside}\``);

  d.client.collections[name.inside.addBrackets()] = new Discord.Collection();

  return {
    code: code.replaceLast(`$createCollection${name}`, ""),
  };
};
