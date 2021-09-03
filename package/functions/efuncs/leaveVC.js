module.exports = async (d) => {
  const state = d.client.voiceManager.servers.get(d.guild.id) 

  if (!(state))
    return d.error(`${d.func}: Bot is not in any voice channel`);
state.leaveVc() 

  return {
    code: d.command.code.replaceLast(`$leaveVC${d.unpack()}`, '')
  }
}