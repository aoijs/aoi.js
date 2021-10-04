module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$deleteEmojis").length - 1;

  const inside = code.split("$deleteEmojis")[r].after();

  for (const emoji of inside.splits) {
    const option = emoji.includes(":")
      ? emoji.split(":")[2].split(">")[0]
      : emoji;

    const EMOJI = d.message.guild.emojis.cache.get(option);

    if (!EMOJI)
      return d.error(`❌ Invalid emoji in \`$deleteEmojis${inside}\``);

    const del = await EMOJI.delete().catch((err) => {});

    if (!del) return d.error(`❌ Failed to delete ${EMOJI.name}!`);
  }

  return {
    code: code.replaceLast(`$deleteEmojis${inside}`, ""),
  };
};
