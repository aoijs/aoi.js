module.exports = async d => {
    const data = d.util.aoiFunc(d);
    const [guildID = d.guild?.id] = data.inside.splits;

    const guild = await d.util.getGuild(d, guildID)

    data.result = guild?.members.cache.filter(x => x.user.bot).size || 0
    return {
        code: d.util.setCode(data)
    }
}