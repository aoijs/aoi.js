module.exports = async (d) => {
  let code = d.command.code;

  const inside = d.unpack()
  const  err = d.inside(inside)
  if(err) return d.error(err) 
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

  const channel =await d.util.getChannel(d,channelID)

  if (!channel)
    return d.error(d.aoiError.functionErrorResolve(d,"channel",{inside}));

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
      `${d.func}: Failed to edit channel`
    );
  }

  return {
    code: code.replaceLast(`$editChannel${inside.total}`, ""),
  };
};
