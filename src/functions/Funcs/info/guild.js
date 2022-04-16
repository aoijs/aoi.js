module.exports = async (d) => {
  const data = d.util.openFunc(d);

  const [id = d.guild?.id, option = "name"] = data.inside.splits;
  let server = await d.util.getGuild(d, id);

  let Data = {};
  Object.assign(Data, server);
  delete Data.client;
  Data.icon = server.iconURL();
  Data.features = Data.features.join(" , ");
  Data.commands = Data.commands.cache.size;
  delete Data.members;
  Data.channels = Data.channels.cache.size;
  Data.bans = Data.bans.cache.size;
  Data.roles = Data.roles.cache.size;
  Data.createdAt = server.createdAt;
  Data.createdTimestamp = server.createdTimestamp;

  delete Data.presence;
  delete Data.voiceStates;
  delete Data.stageInstances;
  Data.invites = Data.invites.size;
  Data.systemChannelFlags =
    Data.systemChannelFlags.toArray().join(" ") === ""
      ? "none"
      : Data.systemChannelFlags.toArray().join(" ");
  Data.owner = server.members.cache.get(Data.ownerId).username;

  Data.shard = undefined;
  Data.afkChannel = Data.afkChannelId;
  Data.systemChannel = Data.systemChannelId;
  Data.rulesChannel = Data.rulesChannelId;
  Data.me = undefined;
  Data.voiceAdapterCreator = undefined;
  Data.updatesChannel = Data.publicUpdatesChannelId;
  Data.joinAt = Data.joinAt?.toString();

  Data.emojis = Data.emojis.cache.size;
  Data.stickers = Data.stickers.cache.size;
  Data.json = JSON.stringify(Data, null, 2);
  data.result = Data[option];

  return {
    code: d.util.setCode(data),
  };
};
