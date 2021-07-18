module.exports = async (d) => {
  let code = d.command.code;

  const r = code.split("$editChannel").length - 1;
  const inside = code.split("$editChannel")[r].after();

  const err = d.inside(inside);

  if (err) return d.error(err);

  const [
    channelID,
    categoryID = "$default",
    name = "$default",
    position = "$default",
    nsfw = "$default",
    bitrate = "$default",
    userLimit = "$default",
    syncPermission = "no",
    reason,
  ] = inside.splits;

  const channel = d.message.guild.channels.cache.get(channelID);

  if (!channel)
    return d.error(
      `\`${d.func}: Invalid channel given in ${inside}\``
    );

  try {
    await channel.edit(
      {
        parentID: categoryID === "$default" ? channel.parentID : categoryID,
        name: name === "$default" ? channel.name : name,
        position:
          position === "$default"
            ? channel.position
            : Number(position) || channel.position,
        nsfw: nsfw === "$default" ? channel.nsfw : nsfw === "yes",
        bitrate:
          bitrate === "$default" ? channel.bitrate : Number(bitrate) || 64,
        userLimit:
          userLimit === "$default" ? channel.userLimit : Number(userLimit) || 0,
        lockPermissions: syncPermission === "yes",
      },
      reason
    );
  } catch (err) {
    console.error(err);
    return d.error(
      `\`${d.func}: Failed to edit channel in ${inside}\``
    );
  }

  return {
    code: code.replaceLast(`$editChannel${inside}`, ""),
  };
};
