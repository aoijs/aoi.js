module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);
  
  if (err) return d.error(err);

  const ch = d.message.guild.channels.cache.get(inside.inside);

  if (!ch) return d.error(d.aoiError.functionErrorResolve(d,"channel",{inside}));

  if (ch.type !== 'GUILD_VOICE') return d.error(`${d.func}: Specified channel is not a voiceChannel in \`$joinVC${inside}\``);

    let con = await d.client.voiceManager.joinVc(ch,d.channel)

  if (!con) return d.error(`${d.func}: Failed to join voice channel`);

  return {
    code: code.replaceLast(`$joinVC${inside}`, '')
  }
}