module.exports = async (d) => {
  const state = d.message.guild.voice;

  if (!(state && state.channel))
    return d.error(`:x: Bot is not in any voice channel`);

  await state.channel.leave();

  return {
    code: d.command.code.replaceLast(`$leaveVC${d.unpack()}`, '')
  }
}