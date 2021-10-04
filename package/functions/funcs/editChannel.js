module.exports = async (d) => {
  let code = d.command.code;

  const r = code.split("$editChannel").length - 1;
  const inside = code.split("$editChannel")[r].after();

  if (!inside.splits.length)
    return d.error(`:x: Invalid usage in $editChannel${inside.total}`);

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
      `:x: Invalid channel given in \`$editChannel${inside.total}\``
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
      `:x: Failed to edit channel in \`$editChannel${inside.total}\``
    );
  }

  return {
    code: code.replaceLast(`$editChannel${inside.total}`, ""),
  };
};
