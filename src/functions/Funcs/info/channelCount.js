module.exports = async (d) => {
  const { code } = d.command;
  const inside = d.unpack();

  const [guildId = d.guild.id, type = "all"] = inside.splits;

  const guild = await d.util.getGuild(d, guildId);
  if (!guild) return d.aoiError.fnError(d, "guild", { inside });

  const result =
    type === "all"
      ? guild.channels.cache.size
      : guild.channels.cache.filter((x) =>
          type === "Nsfw" ? x.nsfw === true : x.type === d.util.channelTypes[type],
        ).size;

  return {
    code: d.util.setCode({ function: d.func, code, inside, result }),
  };
};
