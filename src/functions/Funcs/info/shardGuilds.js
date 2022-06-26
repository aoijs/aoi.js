module.exports = async (d) => {
    const data = d.util.aoiFunc(d);

    const [option = "id", sep = " , ", shardId] = data.inside.splits;
    if (shardId && isNaN(shardId))
        return d.aoiError.fnError(
            d,
            "custom",
            {inside: data.inside},
            "Invalid ShardId Provided In",
        );

    function evalfunc(client, {option, sep}) {
        return client.guilds.cache
            .map((x) => eval(option === "" ? x : `x.${option}`))
            .join(sep);
    }

    const arr = await d.client.shard.broadcastEval(evalfunc, {
        shard: !shardId ? undefined : Number(shardId),
        context: {option: option, sep: sep},
    });

    data.result = arr.join(sep);

    return {
        code: d.util.setCode(data),
    };
};