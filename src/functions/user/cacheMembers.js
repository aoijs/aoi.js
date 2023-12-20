module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);
    const [guildID = d.guild.id, returnCount = "false"] = data.inside.splits;
    let result;
  
    const guild = await d.util.getGuild(d, guildID);
    if (!guild) return d.aoiError.fnError(d, "guild", { inside: data.inside });
  
    if (guild.memberCount > guild.members.cache.size) {
      result = await guild.members.fetch().catch((err) => {
        d.aoiError.fnError(
          d,
          "custom",
          {},
          "Failed To Fetch Members With Reason :" + err
        );
      });
    }
  
    data.result = returnCount === "true" ? guild.members.cache.size.toString() : undefined;
  
    return {
      code: d.util.setCode(data),
    };
  };