const Discord = require("discord.js");
module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);
  if (err) return d.error(err);
  const [url, name = "image.webp", type = "url"] = inside.splits;
  const attachment = new Discord.MessageAttachment(
    type === "buffer" ? Buffer.from(url.addBrackets()) : url.addBrackets(),
    name.addBrackets()
  );
    d.files.push(attachment)
  return {
    code: code.replaceLast(`$attachment${inside.total}`, ""),
    files:d.files,
  };
};
