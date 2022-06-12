module.exports = async d => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const shardId = data.inside.inside;

    await d.client.shard.broadcastEval(c => {
        if (c.shard.ids.includes(Number(shardId))) process.exit();
    });

    return {
        code: d.util.setCode(data)
    }
}