module.exports = async d => {
    const dat = d.util.aoiFunc(d);

    const [id = d.guild?.id, option = 'name'] = dat.inside.splits;
    let server = await d.util.getGuild(d, id)

    let data = {}
    Object.assign(data, server)
    delete data.client
    data.icon = server.iconURL()
    data.features = data.features.join(" , ")
    data.commands = data.commands.cache.size
    delete data.members
    data.channels = data.channels.cache.size
    data.bans = data.bans.cache.size
    data.roles = data.roles.cache.size
    data.createdAt = server.createdAt;
    data.createdTimestamp = server.createdTimestamp;

    delete data.presence
    delete data.voiceStates
    delete data.stageInstances
    data.invites = data.invites.size
    data.systemChannelFlags = (data.systemChannelFlags.toArray().join(" ") === "" ? "none" : data.systemChannelFlags.toArray().join(" "))
    data.owner = server.members.cache.get(data.ownerId).username

    data.shard = undefined
    data.afkChannel = data.afkChannelId
    data.systemChannel = data.systemChannelId
    data.rulesChannel = data.rulesChannelId
    data.me = undefined
    data.voiceAdapterCreator = undefined
    data.updatesChannel = data.publicUpdatesChannelId
    data.joinAt = data.joinAt?.toString()

    data.emojis = data.emojis.cache.size
    data.stickers = data.stickers.cache.size
    data.json = JSON.stringify(data, null, 2)
    dat.result = data[option];

    return {
        code: d.util.setCode(dat)
    }
}