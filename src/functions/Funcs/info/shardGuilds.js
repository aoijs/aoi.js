module.exports = async d => {
    const data = d.util.openFunc(d);

    const [option = 'id', sep = ' , ', shardId] = data.inside.splits;
    if (shardId && isNaN(shardId)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid ShardId Provided In');

    const arr = await d.client.shard.broadcastEval(client => client.guilds.cache.map(x => eval(`x.${option}`)).join(sep), {shard: !shardId ? undefined  : Number(shardId)});

    data.result = arr.join(sep);

    return {
        code: d.util.setCode(data)
    }
}