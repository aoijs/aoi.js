module.exports = d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const shardId = data.inside.inside;
    if (!d.client.clientShard) return d.aoiError.fnError(d, 'custom', {}, 'ClientShard Class is Not Initialised');

    d.client.clientShard.shards.get(shardId).spawn();

    return {
        code: d.util.setCode(data)
    }

}