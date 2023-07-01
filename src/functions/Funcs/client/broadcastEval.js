module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    if (data.err) return d.error(data.err);

    const [func] = data.inside.splits;

    function evalfunc(client, {func}) {
        return eval(func)
    }

    data.result = await d.client.shard.broadcastEval(evalfunc, {context: {func: func}});

    data.result = data.result.join(" , ");

    return {
        code: d.util.setCode(data),
    };
};