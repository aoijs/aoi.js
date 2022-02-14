const Util = require("../../../classes/Util.js");

module.exports = async (d) => {
  const data = d.util.openFunc(d);
  if (data.err) return d.error(data.err);

  let [type, track] = data.inside.splits;
  type = Util.searchType.indexOf(type.toLowerCase());
  if(type === -1 ) return d.aoiError.fnError(d,"custom",{inside : data.inside},"Invalid SearchType Provided I")
  if (!d.client.voiceManager)
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "Voice Class Is Not Initialised",
    );
  const player = d.client.voiceManager.manager.players.get(d.guild.id);
  if (!player)
    return d.aoiError.fnError(
      d,
      "custom",
      { inside: data.inside },
      "Client Is Not Connected To Voice/Stage.",
    );

  const trackid = await player.search(track.addBrackets(), type);
  const tracklist = await player.addTrack({
    urls: trackid,
    type: type,
    member: d.member,
  });
  data.result = `Added ${tracklist}`;

  return {
    code: d.util.setCode(data),
  };
};
