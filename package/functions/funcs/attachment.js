const Discord = require("discord.js");

module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$attachment").length - 1;

  const inside = code.split("$attachment")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [url, name = "image.webp", type = "url"] = inside.splits;

  const attachment = new Discord.MessageAttachment(
    type === "buffer" ? Buffer.from(url.addBrackets()) : url.addBrackets(),
    name.addBrackets()
  );

  return {
    code: code.replaceLast(`$attachment${inside.total}`, ""),
    embed: d.embed.attachFiles(attachment),
  };
};
