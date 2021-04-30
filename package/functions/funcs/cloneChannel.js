module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$cloneChannel").length - 1;

  const after = code.split("$cloneChannel")[r].after();

  if (after.inside) {
    const [channelID, returnID = "no"] = after.splits;

    let channel = d.message.guild.channels.cache.get(channelID);

    if (!channel)
      return d.error(`:x: Invalid channel ID in \`$cloneChannel${after}\``);

    const data = {
      name: channel.name,
      position: channel.position,
    };

    channel = await channel.clone().catch((Err) => {});

    if (!channel) return d.error(`:x: Failed to clone channel`);

    await channel.setName(data.name);
    await channel.setPosition(data.position);

    return {
      code: code.replaceLast(
        `$cloneChannel${after}`,
        returnID === "yes" ? channel.id : ""
      ),
    };
  } else {
    const data = {
      name: d.message.channel.name,
      position: d.message.channel.position,
    };

    const channel = await d.message.channel.clone().catch((Err) => {});

    if (!channel) return d.error(`:x: Failed to clone channel`);

    await channel.setName(data.name);
    await channel.setPosition(data.position);

    return {
      code: code.replaceLast(`$cloneChannel`, ""),
    };
  }
};
