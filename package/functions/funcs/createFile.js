const Discord = require("discord.js");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$createFile").length - 1;

  const inside = code.split("$createFile")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const fields = inside.splits;

  const name = fields.pop().addBrackets();

  const text = fields.join(";").addBrackets();

  const attachment = new Discord.MessageAttachment(Buffer.from(text), name);

  return {
    code: code.replaceLast(`$createFile${inside}`, ""),
    embed: d.embed.attachFiles(attachment),
  };
};
