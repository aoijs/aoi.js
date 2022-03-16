module.exports = async (d) => {
  const data = d.util.openFunc(d);

  const [
    voiceId = d.member.voice?.channelId,
    selfMute = "no",
    selfDeaf = "yes",
    speaker = "yes",
    debug = "no",
  ] = data.inside.splits;

  const vc = await d.util.getChannel(d, voiceId);

  if (![d.util.channelTypes.Voice, d.util.channelTypes.Stage].includes(vc.type))
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "Provided ChannelId Is Not Voice/Stage Channel In",
    );

  if (!d.client.voiceManager)
    return d.aoiError.fnError(
      d,
      "custom",
      {},
      "Voice Class Is Not Initialised.",
    );

  try {
    await d.client.voiceManager.manager.joinVc({
      voiceChannel: vc,
      textChannel: d.channel,
      selfMute: selfMute === "yes",
      selfDeaf: selfDeaf === "yes",
      debug: debug === "yes",
    });
    if(speaker === "yes" && vc.type === d.util.channelTypes.Stage) {
    d.guild.me.voice.setSuppressed(false);
    }
  } catch (e) {
    d.aoiError.fnError(d, "custom", {}, "Failed To Join Vc With Reason: " + e);
  }

  return {
    code: d.util.setCode(data),
  };
};
