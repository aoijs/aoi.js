module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [shardId = 0] = data.inside.splits;

    if (isNaN(shardId))
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid ShardId Provided In",
        );

    data.result = await d.client.shard.broadcastEval((c) => c.ws.ping, {
        shard: Number(shardId),
    });

    return {
        code: d.util.setCode(data),
    };
};