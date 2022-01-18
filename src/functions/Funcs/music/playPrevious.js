module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  const [type, track] = data.inside.splits;

  if (!d.client.voiceManager)
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "Voice Class Is Not Initialised",
    );
    const player = d.client.voiceManager.players.get(d.guild.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "Not Connected To Voice/Stage",
    );

  const trackid = await player
    .search(track, type);
  const tracklist = await player
    .addTrack({ urls: e, type: type, member: d.member });
    data.result = `Playing Previous Track: ${tracklist}`;

    return {
      code:d.util.setCode(data)
    }
};
