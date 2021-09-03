module.exports = async (d) => {
  const code = d.command.code;

  const inside = d.unpack();
  const option = inside.inside ? inside.inside.trim() : d.message.author.id;

  const member =
    (await d.message.guild.members.fetch(option).catch(d.noop)) || null;

  if (!member) return d.error(`:x: Invalid user ID in \`$voiceID${inside}\``);

  return {
    code: code.replaceLast(
      `$voiceID${inside}`,
      member.voice.channel ? member.voice.channel.id : ""
    ),
  };
};
