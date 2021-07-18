module.exports = async (d) => {
  const code = d.command.code;
  const inside = d.unpack();
  const err = d.inside(inside);
  
  if (err) return d.error(err);

  const ch = d.message.guild.channels.cache.get(inside.inside);

  if (!ch) return d.error(`\`${d.func}: Invalid channel ID in ${inside}\``);

  if (ch.type !== 'voice') return d.error(`\`${d.func}: Specified channel is not a voiceChannel in ${inside}\``);

  const con = await ch.join().catch(d.noop);

  if (!con) return d.error(`\`Failed to join voice channel\``);

  return {
    code: code.replaceLast(`$joinVC${inside}`, '')
  }
}