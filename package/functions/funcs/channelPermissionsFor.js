module.exports = async (d) => {
  return await (async () => {
    const code = d.command.code;

    const r = code.split("$channelPermissionsFor").length - 1;

    const inside = code.split("$channelPermissionsFor")[r].after();

    const err = d.inside(inside);

    if (err) return d.error(err);

    const fields = inside.splits;

    const userID = fields.length === 1 ? fields[0] : fields[1];

    const channelID = fields.length === 1 ? d.message.channel.id : fields[0];

    const member = await d.message.guild.members
      .fetch(userID)
      .catch((err) => null);

    if (!member)
      return d.error(
        `❌ Invalid user ID in \`$channelPermissionsFor${inside}\``
      );

    if (!d.message.guild.channels.cache.has(channelID))
      return d.error(
        `❌ Invalid channel ID in \`$channelPermissionsFor${inside}\``
      );

    return {
      code: code.replaceLast(
        `$channelPermissionsFor${inside}`,
        member.permissionsIn(channelID).toArray().goof()
      ),
    };
  })();
};
