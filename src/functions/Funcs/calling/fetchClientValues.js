module.exports = async d => {
    const data = d.util.openFunc(d);
    if (data.err) return d.error(data.err);

    const [func] = data.inside.splits;

    data.result = await d.client.shard.fetchClientValues(func);

    return  {
        code:d.util.setCode(data),
    }
}