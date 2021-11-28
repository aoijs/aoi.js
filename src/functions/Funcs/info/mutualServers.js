module.exports = async d => {
    const data = d.util.openFunc(d);

    const [userId = d.author?.id, sep = ' , '] = data.inside.splits;

    const mutuals = d.client.guilds.cache.filter(x => x.members.cache.has(userId));

    data.result = mutuals.map(x => x.id).join(sep);

    return {
        code: d.util.setCode(data)
    }
}