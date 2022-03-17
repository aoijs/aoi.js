module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  let [emoji, guildId = d.guild?.id] = data.inside.splits;
  emoji = emoji.split(":");
  if (emoji.length > 1) {
    emoji = emoji.pop().replace(">");
  } else {
    emoji = emoji[0];
  }

  const guild =
    guildId === "global" ? d.client : await d.util.getGuild(d, guildId);
  if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });

  let isemoji = await guild.emojis.cache.find(x => x.toString() === emoji).catch((e) => undefined);

  data.result = isemoji ? true : false;

  return {
    code: d.util.setCode(data),
  };
};
