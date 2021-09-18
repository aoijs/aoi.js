module.exports = async (d) => {
  const code = d.command.code;

  const r = code.split("$isChannelManageable").length - 1;

  const after = code.split("$isChannelManageable")[r].after();

  if (after.inside) {
    const id = after.inside;

    const channel = d.message.guild.channels.cache.get(id);

    if (!channel)
      return d.error(`\`${d.func}: Invalid channel ID ${after}\``);

    return {
      code: code.replaceLast(`$isChannelManageable${after}`, channel.manageable),
    };
  } else {
    return {
      code: code.replaceLast(`$isChannelManageable`, d.message.channel.manageable),
    };
  }
};
