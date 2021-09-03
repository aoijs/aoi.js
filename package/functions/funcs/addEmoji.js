module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);
  if (err) return d.error(err);
  const [url, name, returnEmoji = "no", ...roleIDs] = inside.splits;
  const emoji = await d.guild.emojis?.create(
      url.addBrackets(),
      name.addBrackets(),
      roleIDs.length?roleIDs:undefined
    )
    .catch((err) => {});
  if (!emoji)
    return d.error(`\`${d.func}: Failed to create emoji! url: ${url}, name: ${name} \``);

  return {
    code: code.replaceLast(
      `$addEmoji${inside.total}`,
      returnEmoji === "yes" ? emoji.toString() : ""
    ),
  };
};
