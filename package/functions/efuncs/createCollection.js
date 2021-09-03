const Discord = require("discord.js");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$createCollection").length - 1;

  const name = code.split("$createCollection")[r].after();

  if (!name.inside) return d.error(`:x: Invalid usage in $ban${inside}`);

  d.client.collections[name.inside.addBrackets()] = new Discord.Collection();

  return {
    code: code.replaceLast(`$createCollection${name}`, ""),
  };
};
