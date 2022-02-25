module.exports = async d => {
    const data = d.util.openFunc(d);

    const [option = 'id', sep = ' , ', shardId = 0] = data.inside.splits;
    if (!d.client.clientShard) return d.aoiError.fnError(d, 'custom', {}, 'ClientShard Class is Not Initialised')
    if (isNaN(shardId)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid ShardId Provided In');

    const arr = await d.client.clientShard.broadcastEval(client => client.guilds.cache.map(x => x[option]).join(sep), {shardId: Number(shardId)});

    data.result = arr.join(sep);

    return {
        code: d.util.setCode(data)
    }
}