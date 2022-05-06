module.exports = async (d) => {
  const { code } = d.util.openFunc(d);

  const state = d.client.voiceManager?.manager.players.get(d.guild.id);

  if (!state)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      `Bot is not in any voice channel`,
    );
  const msgId = d.client.voiceManager.prunes.get(state.textChannel.id);
  if (msgId) {
    const msg = await state.textChannel.messages
      .fetch(msgId)
      .catch((_) => undefined);
    if (msg) msg.delete();
  }
  state.leaveVc();

  return {
    code: d.util.setCode({ function: d.func, code }),
  };
};
