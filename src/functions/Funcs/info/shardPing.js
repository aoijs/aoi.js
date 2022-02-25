module.exports = d => {
    const data = d.util.openFunc(d);

    const [shardId = 0] = data.inside.splits;

    if (isNaN(shardId)) return d.aoiError.fnError(d, 'custom', {inside: data.inside}, 'Invalid ShardId Provided In');

    data.result = d.client.ws.shards.get(Number(shardId))?.ping || 0;

    return {
        code: d.util.setCode(data)
    }
}